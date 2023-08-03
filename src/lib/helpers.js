import { action_destroyer } from 'svelte/internal';
import { UMAP } from 'umap-js';


export function transformData(array) {
  // This transforms the protein object from the GET request for amino action_destroyer, raw from database
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
  try {
    let umap = new UMAP({nComponents: 4});
    // Extract the 'embedding' property from each object in the selected_protein array
    let embeddings = selected_protein.map(protein => protein.embeddings);

    let embedding = umap.fit(embeddings);

    // Iterate over the selected_protein array and add the UMAP components to each object
    selected_protein = selected_protein.map((protein, i) => {
      return {...protein, 
              umap_component0: embedding[i][0], 
              umap_component1: embedding[i][1],
              umap_component2: embedding[i][2], 
              umap_component3: embedding[i][3]};
    })
    console.log({'test':selected_protein})
    return selected_protein;
  } catch (error) {
    console.error('ERROR',error);
  }
};