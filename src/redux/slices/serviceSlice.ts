import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getPagingServices } from '@/services/apiv2'

interface ServiceState {
    allService: Array<any>
    isLoading: boolean
}

const defaultState: ServiceState = {
    allService: [],
    isLoading: true,
}

const serviceSlice = createSlice({
    name: 'service',
    initialState: defaultState,
    reducers: {},
    extraReducers: (builders) =>
        builders
            .addCase(getAllServices.fulfilled, (state, { payload }) => {
                const { data } = payload
                state.allService = data?.data || []
                state.isLoading = false
            })
            .addCase(getAllServices.rejected, (state, { payload }) => {
                state.allService = []
                state.isLoading = false
            }),
})

export const getAllServices = createAsyncThunk(
    'service/getAllServices',
    async (data: any) => {
        try {
            // get all
            const result = await getPagingServices('', 0, 0)

            return result?.data
        } catch (error: any) {
            console.log(error)
        }
    }
)

const { reducer: serviceReducer, actions } = serviceSlice

export const {} = actions

export default serviceReducer
