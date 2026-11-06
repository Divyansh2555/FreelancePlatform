"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    getMyProjects,
    createProject,
} from "../../lib/api/services/client/CreateProjects";

import type {
    Project,
    CreateProjectRequest,
} from "../../types/client/CreateProjects";

const CACHE_KEY = "my_projects";
const CACHE_TIME = 5 * 60 * 1000;

type CachedProjects = {
    data: Project[];
    timestamp: number;
};

function getCachedProjects(): Project[] | null {
    if (typeof window === "undefined") return null;

    try {
        const raw = localStorage.getItem(CACHE_KEY);

        if (!raw) return null;

        const cached = JSON.parse(raw) as CachedProjects;

        if (
            !cached ||
            !Array.isArray(cached.data) ||
            typeof cached.timestamp !== "number"
        ) {
            localStorage.removeItem(CACHE_KEY);
            return null;
        }

        if (Date.now() - cached.timestamp > CACHE_TIME) {
            localStorage.removeItem(CACHE_KEY);
            return null;
        }

        return cached.data;
    } catch (error) {
        console.warn("Get project cache error:", error);
        return null;
    }
}

function setCachedProjects(projects: Project[]) {
    if (typeof window === "undefined") return;

    try {
        const cached: CachedProjects = {
            data: projects,
            timestamp: Date.now(),
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
    } catch (error) {
        console.warn("Project cache error:", error);
    }
}

function removeCachedProjects() {
    if (typeof window === "undefined") return;

    try {
        localStorage.removeItem(CACHE_KEY);
    } catch (error) {
        console.warn("Remove project cache error:", error);
    }
}

function extractProjects(response: unknown): Project[] {
    if (Array.isArray(response)) {
        return response as Project[];
    }

    if (!response || typeof response !== "object") {
        return [];
    }

    const value = response as {
        data?: unknown;
        projects?: unknown;
    };

    if (Array.isArray(value.data)) {
        return value.data as Project[];
    }

    if (Array.isArray(value.projects)) {
        return value.projects as Project[];
    }

    return [];
}

function extractProject(response: unknown): Project | null {
    if (!response || typeof response !== "object") {
        return null;
    }

    const value = response as {
        id?: number;
        data?: unknown;
        project?: unknown;
    };

    if (
        value.data &&
        typeof value.data === "object" &&
        !Array.isArray(value.data)
    ) {
        return value.data as Project;
    }

    if (
        value.project &&
        typeof value.project === "object" &&
        !Array.isArray(value.project)
    ) {
        return value.project as Project;
    }

    if (typeof value.id === "number") {
        return response as Project;
    }

    return null;
}

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const requestRef = useRef<Promise<Project[]> | null>(null);
    const initializedRef = useRef(false);

    const syncProjects = useCallback((data: Project[]) => {
        setProjects(data);
        setCachedProjects(data);
    }, []);

    const fetchMyProjects = useCallback(
        async (force = false): Promise<Project[] | null> => {
            if (!force) {
                const cached = getCachedProjects();

                if (cached !== null) {
                    setProjects(cached);
                    setLoading(false);
                    setError("");
                    return cached;
                }
            }

            if (requestRef.current) {
                try {
                    return await requestRef.current;
                } catch {
                    return null;
                }
            }

            setError("");

            if (force) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const request = (async (): Promise<Project[]> => {
                const response = await getMyProjects();
                return extractProjects(response);
            })();

            requestRef.current = request;

            try {
                const data = await request;
                syncProjects(data);
                return data;
            } catch (err) {
                console.error("GET projects error:", err);

                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load projects."
                );

                return null;
            } finally {
                if (requestRef.current === request) {
                    requestRef.current = null;
                    setLoading(false);
                    setRefreshing(false);
                }
            }
        },
        [syncProjects]
    );

    const postProject = useCallback(
        async (
            payload: CreateProjectRequest
        ): Promise<Project | null> => {
            try {
                setSubmitting(true);
                setError("");
                setSuccess("");

                const response = await createProject(payload);
                const newProject = extractProject(response);

                if (newProject) {
                    setProjects((previous) => {
                        const updated = [
                            newProject,
                            ...previous.filter(
                                (project) => project.id !== newProject.id
                            ),
                        ];

                        setCachedProjects(updated);
                        return updated;
                    });
                } else {
                    removeCachedProjects();
                    await fetchMyProjects(true);
                }

                setSuccess(
                    "Your project has been posted successfully!"
                );

                return newProject;
            } catch (err) {
                console.error("POST project error:", err);

                const message =
                    err instanceof Error
                        ? err.message
                        : "Failed to post project.";

                setError(message);
                throw err;
            } finally {
                setSubmitting(false);
            }
        },
        [fetchMyProjects]
    );

    const refreshProjects = useCallback(async () => {
        removeCachedProjects();
        return fetchMyProjects(true);
    }, [fetchMyProjects]);

    const clearError = useCallback(() => {
        setError("");
    }, []);

    const clearSuccess = useCallback(() => {
        setSuccess("");
    }, []);

    const clearCache = useCallback(() => {
        removeCachedProjects();
        setProjects([]);
    }, []);

    useEffect(() => {
        if (initializedRef.current) return;

        initializedRef.current = true;
        void fetchMyProjects();
    }, [fetchMyProjects]);

    return {
        projects,
        loading,
        submitting,
        refreshing,
        error,
        success,
        fetchMyProjects,
        refreshProjects,
        postProject,
        clearError,
        clearSuccess,
        clearCache,
    };
}

export default useProjects;