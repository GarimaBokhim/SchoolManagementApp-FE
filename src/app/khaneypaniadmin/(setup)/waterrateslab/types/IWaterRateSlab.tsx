export interface WaterRateSlabResponse {
    id: string
    name: string
}

export interface WaterRateSlabDetail {
    WaterTariffId: string
    SlabNumber: number
    FromUnit: number
    ToUnit: number | null
    RatePerUnit: number
}

export interface WaterRateSlabDetailsResponse {
    Data: WaterRateSlabDetail[]
    Message: string
    StatusCode: number
}

export interface NewWaterRateSlab {
    toUnit: number
    ratePerUnit: number
}

export interface AddWaterRateSlabPayload {
    waterTariffId: string
    name: string
    newRateSlabs: NewWaterRateSlab[]
}

export interface AddWaterRateSlabRequest {
    WaterTariffId: string
    Name: string
    NewRateSlabs: {
        ToUnit: number | null
        RatePerUnit: number
    }[]
}

export interface UpdateWaterRateSlabPayload {
    name: string
    slabs: {
        slabNo: number
        toUnit: number | null
        ratePerUnit: number
    }[]
}
