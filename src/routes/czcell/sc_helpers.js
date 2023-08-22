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



export function getContinuous(arrayOfObjects) {
    const keysToDrop = ['umap_x', 'umap_y', 'cell_id', 'created_at', 'id'];

    const summary = arrayOfObjects.reduce((summary, obj) => {
        // Create a copy of the object without the keys to drop
        const filteredObj = { ...obj };
        keysToDrop.forEach(key => delete filteredObj[key]);

        Object.entries(filteredObj).forEach(([key, value]) => {
            // Check if value can be cast to a float
            if (!isNaN(Number(value))) {
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
