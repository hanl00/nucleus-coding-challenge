const prices = [
    { effectiveDate: new Date(2021, 8, 1, 5, 0, 0), price: 35464.53 },
    { effectiveDate: new Date(2021, 8, 2, 5, 0, 0), price: 35658.76 },
    { effectiveDate: new Date(2021, 8, 3, 5, 0, 0), price: 36080.06 },
    { effectiveDate: new Date(2021, 8, 3, 13, 0, 0), price: 37111.11 },
    { effectiveDate: new Date(2021, 8, 6, 5, 0, 0), price: 38041.47 },
    { effectiveDate: new Date(2021, 8, 7, 5, 0, 0), price: 34029.61 },
];

const transactions = [
    { effectiveDate: new Date(2021, 8, 1, 9, 0, 0), value: 0.012 },
    { effectiveDate: new Date(2021, 8, 1, 15, 0, 0), value: -0.007 },
    { effectiveDate: new Date(2021, 8, 4, 9, 0, 0), value: 0.017 },
    { effectiveDate: new Date(2021, 8, 5, 9, 0, 0), value: -0.01 },
    { effectiveDate: new Date(2021, 8, 7, 9, 0, 0), value: 0.1 },
];

export function getDailyPortfolioValues() {
    var currentDate = new Date(2021, 8, 1);
    const timezoneOffset = -currentDate.getTimezoneOffset() * 60 * 1000;
    const dayAfterEndDate = new Date(2021, 8, 8);

    currentDate.setTime(currentDate.getTime() + timezoneOffset);
    dayAfterEndDate.setTime(dayAfterEndDate.getTime() + timezoneOffset);

    const bitcoinValue = {};
    const totalBitcoinAmount = {};
    var bitcoinCounter = 0;

    prices.forEach((priceDates) => {
        const dateString = priceDates.effectiveDate.toISOString().split("T")[0];
        bitcoinValue[dateString] = priceDates.price;
    });

    transactions.forEach((transactionDates) => {
        const dateString = transactionDates.effectiveDate
            .toISOString()
            .split("T")[0];

        bitcoinCounter += transactionDates.value;
        totalBitcoinAmount[dateString] = bitcoinCounter;
    });

    const portfolioValue = [];
    var lastAvailablePrice = undefined;
    var lastAvailableBitcoinAmount = 0;

    while (currentDate.getDate() != dayAfterEndDate.getDate()) {
        const currentDateISOFormat = currentDate.toISOString().split("T")[0];
        const dailyPortfolioValue = {};
        const dailyPriceData = bitcoinValue[currentDateISOFormat];
        const dailyBitcoinTotal = totalBitcoinAmount[currentDateISOFormat];

        lastAvailablePrice =
            dailyPriceData === undefined ? lastAvailablePrice : dailyPriceData;
        lastAvailableBitcoinAmount =
            dailyBitcoinTotal === undefined
                ? lastAvailableBitcoinAmount
                : dailyBitcoinTotal;

        dailyPortfolioValue["effectiveDate"] = currentDateISOFormat;
        dailyPortfolioValue["value"] =
            lastAvailablePrice === undefined
                ? "No previous bitcoin value available"
                : parseFloat(
                    (lastAvailablePrice * lastAvailableBitcoinAmount).toFixed(5)
                );

        portfolioValue.push(dailyPortfolioValue);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return portfolioValue;
}

// time complexity = O(n)

/*
Pros:
- able to handle any start and end date range
- able to support any UTC time offset
- additional check to prevent NaN output in situations where bitcoin transactions
  exist earlier than first available bitcoin price
*/
