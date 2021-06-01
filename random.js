const Random = {
    randInt(int) {
        return Math.floor(Math.random() * int)
    },

    shuffle(array) {
        for (let i = array.length - 1; i >= 0; i--) {
            const j = this.randInt(i + 1);
            // console.log("a")
            [array[i], array[j]] = [array[j], array[i]]
        }
        return array;
    },

    randArrayNoRepeat(large, rep) {
        const array = []
        for (let j = 1; j <= large; j++) {
            array.push(j)
        }
        if (array.length < rep) {
            return undefined;
        }
        this.shuffle(array)
        const randArray = []
        for (let i = 0; i < rep; i++) {
            randArray.push(array.pop());
        }
        return randArray
    }
}

export default Random;