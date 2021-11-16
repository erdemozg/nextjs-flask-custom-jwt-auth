import { useDispatch, useSelector } from "react-redux";

/**
 * hooks to interact with client-side global state.
 */
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;