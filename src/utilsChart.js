
export function getOverallData(data) {
    const yearlyData = data.reduce((acc, record) => {
        const year = new Date(record.Date).getFullYear(); // Extract the year from the date
        const existingData = acc.find(item => new Date(item.Date).getFullYear() === year);

        if (existingData) {
            existingData['Adj Close']+=record['Adj Close']
            existingData.Close += record.Close
            existingData.High += record.High;
            existingData.Low += record.Low;
            existingData.Open += record.Open;
            existingData.Volume+=record.Volume
            existingData.Price += record.Price;
            existingData.Count++;
        } else {
            const newDate = new Date(year, 0, 1); // Create a new date object with year and set month and day to '01'
            acc.push({
                Volume :record.Volume,
                Date: newDate,
                'Adj Close':record['Adj Close'],
                Close:record.Close,
                High: record.High,
                Low: record.Low,
                Open: record.Open,
                Price: record.Price,
                Count: 1
            });
        }

        return acc;
    }, []);

    for (let i = 0; i < yearlyData.length; i++) {
        const item = yearlyData[i];
        item.Close /=item.Count;
        item['Adj Close'] /= item.Count;
        item.High /= item.Count;
        item.Low /= item.Count;
        item.Open /= item.Count;
        item.Price /= item.Count;
        item.Volume /= item.Volume
        delete item.Count;
    }

    return yearlyData
}

export function getYearDatabyRange(data, startDate, endDate) {
    const filteredData = data.filter(record => {
      const date = record.Date;
      return date >= startDate && date <= endDate;
    });
  
    const monthlyData = filteredData.reduce((acc, record) => {
      const year = new Date(record.Date).getFullYear();
      const month = new Date(record.Date).getMonth() + 1; // Add 1 to get the month in range 1-12
      const existingData = acc.find(item => item.Year === year && item.Month === month);
  
      if (existingData) {
        existingData["Adj Close"] += record["Adj Close"];
        existingData.Close += record.Close
        existingData.High += record.High;
        existingData.Low += record.Low;
        existingData.Open += record.Open;
        existingData.Price += record.Price;
        existingData.Volume+=record.Volume
        existingData.Count++;
      } else {
        const newDate = new Date(year, month, 1); 
        acc.push({
          Year: year,
          Month: month,
          Date: newDate,
          Close: record.Close,
          Volume :record.Volume,
          'Adj Close':record['Adj Close'],
          High: record.High,
          Low: record.Low,
          Open: record.Open,
          Price: record.Price,
          Count: 1
        });
      }
  
      return acc;
    }, []);
  
    for (let i = 0; i < monthlyData.length; i++) {
      const item = monthlyData[i];
      item.Volume /=item.Volume
      item.Close /= item.Count;
      item["Adj Close"] /= item.Count;
      item.High /= item.Count;
      item.Low /= item.Count;
      item.Open /= item.Count;
      item.Price /= item.Count;
      delete item.Count;
    }
  
    return monthlyData;
  }

  export function groupObjectsByMonth(data, startDate) {
    const startMonth = new Date(startDate).getMonth()-1; // Get the month of the startDate
    const startYear = new Date(startDate).getFullYear(); // Get the year of the startDate
    const endDate = new Date(startYear + 1, startMonth); // Calculate the endDate as startDate + 1 year
    const groupedData = new Array(12).fill(null).map(() => []);
  
    data.forEach(obj => {
      const date = new Date(obj.Date);
      const month = date.getMonth();
      const year = date.getFullYear();
  
      if ((year > startYear || (year === startYear && month >= startMonth)) && (year < endDate.getFullYear() || (year === endDate.getFullYear() && month <= endDate.getMonth()))) {
        groupedData[month].push(obj);
      }
    });
  
    return groupedData;
  }