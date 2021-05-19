/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PriceApiResponse, PriceState } from 'state/types'

const initialState: PriceState = {
  isLoading: false,
  lastUpdated: null,
  data: null,
}

// Thunks
export const fetchPrices = createAsyncThunk<PriceApiResponse>('prices/fetch', async () => {
  const response = await fetch('https://api.pancakeswap.info/api/v2/tokens')
  const data = (await response.json()) as PriceApiResponse

  // Return normalized token names
  return {
    update_at: data.update_at,
    prices: Object.keys(data.prices).reduce((accum, token) => {
      return {
        ...accum,
        [token.toLowerCase()]: data.prices[token],
      }
    }, {}),
  }
})

export const pricesSlice = createSlice({
  name: 'prices',
  initialState,
  reducers: {
    updatePriceList: (state, action) => {
      const { tokens } = action.payload
      if(!tokens) {
        state.isLoading = true;
        return;
      }

      const prices = {}
      for(let i = 0; i < tokens.length; i++) {
        const token = tokens[i]
        if(token.tokenDayData.length > 0) {
          prices[token.id.toLowerCase()] = parseFloat(token.tokenDayData[0].priceUSD)
        }
      }
      state.isLoading = false
      state.lastUpdated = action.payload.update_at
      state.data = prices
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPrices.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchPrices.fulfilled, (state, action: PayloadAction<PriceApiResponse>) => {
      state.isLoading = false
      state.lastUpdated = action.payload.update_at
      state.data = action.payload.prices
    })
  },
})

export default pricesSlice.reducer

// Actions
export const { updatePriceList } = pricesSlice.actions