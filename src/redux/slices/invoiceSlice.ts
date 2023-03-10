import { getAllInvoicesByClientId } from '@/services/apiv2'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface InvoiceState {
    allInvoice: Array<any>
    isLoading: boolean
}

const defaultState: InvoiceState = {
    allInvoice: [],
    isLoading: true,
}

const invoiceSlice = createSlice({
    name: 'invoice',
    initialState: defaultState,
    reducers: {},
    extraReducers: (builders) =>
        builders
            .addCase(getAllInvoicesByClient.fulfilled, (state, { payload }) => {
                const { data } = payload
                state.allInvoice = data || []
                state.isLoading = false
            })
            .addCase(getAllInvoicesByClient.rejected, (state, { payload }) => {
                state.allInvoice = []
                state.isLoading = false
            }),
})

export const getAllInvoicesByClient = createAsyncThunk(
    'invoice/getAllInvoicesByClient',
    async (data: any) => {
        try {
            const result = await getAllInvoicesByClientId()
            return result?.data
        } catch (error: any) {
            return []
        }
    }
)

const { reducer: invoiceReducer, actions } = invoiceSlice

export const {} = actions

export default invoiceReducer
