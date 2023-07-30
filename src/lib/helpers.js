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
  if (!selected_protein) {
    console.log('No protein selected');
    return;
  }

  let umap = new UMAP();
  let embedding = umap.fit(selected_protein);
  console.log(embedding);
};
