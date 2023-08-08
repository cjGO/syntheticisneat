<script>
let data = {big: {}, small: {}};

let keys = ['pc1', 'pc2', 'pc3', 'pc4'];

for (let key in data) {
    keys.forEach(subkey => {
        data[key][subkey] = Array.from({length: 10}, () => {
            return {
                x: Math.random() * 2 - 1,
                y: Math.random() * 2 - 1
            };
        });
    });
}

console.log(data);
</script>
