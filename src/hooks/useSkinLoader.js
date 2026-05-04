import { useStore } from '../context/StoreContext';

export function useSkinLoader(skinKey) {
  const { activeSkin, loading } = useStore();
  
  return {
    isLoading: loading,
    hasSkin: !!activeSkin?.[skinKey],
    skinCode: activeSkin?.[skinKey] || null,
  };
}
