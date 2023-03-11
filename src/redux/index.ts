import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import serviceReducer from './slices/serviceSlice'
import invoiceReducer from './slices/invoiceSlice'

const rootReducer = combineReducers({
    service: serviceReducer,
    invoice: invoiceReducer,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware: any) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

type RootState = ReturnType<typeof rootReducer>
type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
