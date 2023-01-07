var invoce = {
    issuer: {
        name: "Рога і копита - контора"
    },
    lineItem: [
        {
            sequence:1,
            chargeItemReference: {
                product: [
                    {
                        code: "<<код медикамента з словника>>",
                        doseForm: "<<код>>",
                        totalVolume:{},
                    },
                    {},
                ],
            },
            priceComponent: [],
        },
        {
            sequence:2,
        }
    ],
    totalPriceComponent:[],
    totalNet:{},
}