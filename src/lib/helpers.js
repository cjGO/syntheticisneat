import { UMAP } from 'umap-js';


export function transformData(array) {
  return array.map(item => {
      // Get the embeddings string from the object
      let embeddingsString = item.embeddings;

      // Remove the square brackets, single quotes and extra white spaces from the string
      embeddingsString = embeddingsString.replace(/[^0-9.,]/g, '');

      // Split the string into an array using the comma as a separator
      let embeddingsArray = embeddingsString.split(',');

      // Convert the strings in the array to numbers
      embeddingsArray = embeddingsArray.map(Number);

      // Replace the embeddings string in the object with the array
      item.embeddings = embeddingsArray;

      return item;
  });
}




export let runUMAP = (selected_protein) => {

  let umap = new UMAP();
  console.log(selected_protein)
  // Extract the 'embedding' property from each object in the selected_protein array
  let embeddings = selected_protein.map(protein => protein.embeddings);
  console.log(embeddings)

  let embedding = umap.fit(embeddings);

  // Iterate over the selected_protein array and add the UMAP components to each object
  selected_protein = selected_protein.map((protein, i) => {
    return {...protein, umap_component0: embedding[i][0], umap_component1: embedding[i][1]};
  });

  console.log(selected_protein);
  return selected_protein;
};
