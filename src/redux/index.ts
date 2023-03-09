import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import serviceReducer from './slices/serviceSlice'

const rootReducer = combineReducers({
    service: serviceReducer,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

type RootState = ReturnType<typeof rootReducer>
type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
