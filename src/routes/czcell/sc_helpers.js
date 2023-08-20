export   function summarizeKeys(arrayOfObjects) {
  const summary = arrayOfObjects.reduce((summary, obj) => {
      Object.entries(obj).forEach(([key, value]) => {
          // Check if value is a string and cannot be cast to a float
          if (typeof value === 'string' && isNaN(Number(value))) {
              if (!summary[key]) {
                  summary[key] = {
                      values: {},
                      filter: true, // add a filter for each key
                      color_scale: false // add color_scale for each key
                  };
              }
              if (!summary[key].values[value]) {
                  summary[key].values[value] = {
                      count: 0,
                      filter: true // add a filter for each nested value
                  };
              }
              summary[key].values[value].count++;
          }
      });
      return summary;
  }, {});

  return summary;
}