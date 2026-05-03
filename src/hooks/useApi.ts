import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '../utils/api';
import {useUserStore} from '../store/userStore';

// ── Shared ───────────────────────────────────────────────────────────────────
export const useUsers = () => useQuery({queryKey: ['users'], queryFn: api.getUsers});

export const useProducts = () => useQuery({queryKey: ['products'], queryFn: api.getProducts});
export const useAddProduct = () => {
	const qc = useQueryClient();
	return useMutation({mutationFn: api.addProduct, onSuccess: () => qc.invalidateQueries({queryKey: ['products']})});
};
export const useUpdateProduct = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({id, data}: {id: string; data: Parameters<typeof api.updateProduct>[1]}) =>
			api.updateProduct(id, data),
		onSuccess: () => qc.invalidateQueries({queryKey: ['products']})
	});
};
export const useDeleteProduct = () => {
	const qc = useQueryClient();
	return useMutation({mutationFn: api.deleteProduct, onSuccess: () => qc.invalidateQueries({queryKey: ['products']})});
};

export const useRecipes = () => useQuery({queryKey: ['recipes'], queryFn: api.getRecipes});
export const useAddRecipe = () => {
	const qc = useQueryClient();
	return useMutation({mutationFn: api.addRecipe, onSuccess: () => qc.invalidateQueries({queryKey: ['recipes']})});
};
export const useUpdateRecipe = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({id, data}: {id: string; data: Parameters<typeof api.updateRecipe>[1]}) =>
			api.updateRecipe(id, data),
		onSuccess: () => qc.invalidateQueries({queryKey: ['recipes']})
	});
};
export const useDeleteRecipe = () => {
	const qc = useQueryClient();
	return useMutation({mutationFn: api.deleteRecipe, onSuccess: () => qc.invalidateQueries({queryKey: ['recipes']})});
};

// ── Per-user (disabled when no activeUserId) ─────────────────────────────────
function useUid() {
	return useUserStore(s => s.activeUserId);
}

export const useLogEntries = () => {
	const uid = useUid();
	return useQuery({queryKey: ['log', uid], queryFn: () => api.getLog(uid!), enabled: !!uid});
};
export const useAddLogEntry = () => {
	const qc = useQueryClient();
	const uid = useUid();
	return useMutation({
		mutationFn: (d: Parameters<typeof api.addLogEntry>[1]) => api.addLogEntry(uid!, d),
		onSuccess: () => qc.invalidateQueries({queryKey: ['log', uid]})
	});
};
export const useDeleteLogEntry = () => {
	const qc = useQueryClient();
	const uid = useUid();
	return useMutation({
		mutationFn: (id: string) => api.deleteLogEntry(uid!, id),
		onSuccess: () => qc.invalidateQueries({queryKey: ['log', uid]})
	});
};

export const useWeightEntries = () => {
	const uid = useUid();
	return useQuery({queryKey: ['weight', uid], queryFn: () => api.getWeight(uid!), enabled: !!uid});
};
export const useAddWeightEntry = () => {
	const qc = useQueryClient();
	const uid = useUid();
	return useMutation({
		mutationFn: (d: Parameters<typeof api.addWeightEntry>[1]) => api.addWeightEntry(uid!, d),
		onSuccess: () => qc.invalidateQueries({queryKey: ['weight', uid]})
	});
};
export const useDeleteWeightEntry = () => {
	const qc = useQueryClient();
	const uid = useUid();
	return useMutation({
		mutationFn: (id: string) => api.deleteWeightEntry(uid!, id),
		onSuccess: () => qc.invalidateQueries({queryKey: ['weight', uid]})
	});
};

export const useExercises = () => {
	const uid = useUid();
	return useQuery({queryKey: ['exercises', uid], queryFn: () => api.getExercises(uid!), enabled: !!uid});
};
export const useAddExercise = () => {
	const qc = useQueryClient();
	const uid = useUid();
	return useMutation({
		mutationFn: (d: Omit<import('../types/fitness').Exercise, 'id'>) => api.addExercise(uid!, d),
		onSuccess: () => qc.invalidateQueries({queryKey: ['exercises', uid]})
	});
};
export const useUpdateExercise = () => {
	const qc = useQueryClient();
	const uid = useUid();
	return useMutation({
		mutationFn: ({id, data}: {id: string; data: Partial<Omit<import('../types/fitness').Exercise, 'id'>>}) =>
			api.updateExercise(uid!, id, data),
		onSuccess: () => qc.invalidateQueries({queryKey: ['exercises', uid]})
	});
};
export const useDeleteExercise = () => {
	const qc = useQueryClient();
	const uid = useUid();
	return useMutation({
		mutationFn: (id: string) => api.deleteExercise(uid!, id),
		onSuccess: () => qc.invalidateQueries({queryKey: ['exercises', uid]})
	});
};

export const useRoutines = () => {
	const uid = useUid();
	return useQuery({queryKey: ['routines', uid], queryFn: () => api.getRoutines(uid!), enabled: !!uid});
};
export const useAddRoutine = () => {
	const qc = useQueryClient();
	const uid = useUid();
	return useMutation({
		mutationFn: (d: Omit<import('../types/fitness').Routine, 'id'>) => api.addRoutine(uid!, d),
		onSuccess: () => qc.invalidateQueries({queryKey: ['routines', uid]})
	});
};
export const useUpdateRoutine = () => {
	const qc = useQueryClient();
	const uid = useUid();
	return useMutation({
		mutationFn: ({id, data}: {id: string; data: Partial<Omit<import('../types/fitness').Routine, 'id'>>}) =>
			api.updateRoutine(uid!, id, data),
		onSuccess: () => qc.invalidateQueries({queryKey: ['routines', uid]})
	});
};
export const useDeleteRoutine = () => {
	const qc = useQueryClient();
	const uid = useUid();
	return useMutation({
		mutationFn: (id: string) => api.deleteRoutine(uid!, id),
		onSuccess: () => qc.invalidateQueries({queryKey: ['routines', uid]})
	});
};

export const useWorkoutLogs = () => {
	const uid = useUid();
	return useQuery({queryKey: ['workoutLogs', uid], queryFn: () => api.getWorkoutLogs(uid!), enabled: !!uid});
};
export const useAddWorkoutLog = () => {
	const qc = useQueryClient();
	const uid = useUid();
	return useMutation({
		mutationFn: (d: Omit<import('../types/fitness').WorkoutLog, 'id'>) => api.addWorkoutLog(uid!, d),
		onSuccess: () => qc.invalidateQueries({queryKey: ['workoutLogs', uid]})
	});
};
export const useDeleteWorkoutLog = () => {
	const qc = useQueryClient();
	const uid = useUid();
	return useMutation({
		mutationFn: (id: string) => api.deleteWorkoutLog(uid!, id),
		onSuccess: () => qc.invalidateQueries({queryKey: ['workoutLogs', uid]})
	});
};
