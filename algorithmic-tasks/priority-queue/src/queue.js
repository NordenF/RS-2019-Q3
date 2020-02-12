const MaxHeap = require('./max-heap.js');

class PriorityQueue {
    constructor(maxSize) {
        if (maxSize)
            this.maxSize = maxSize;
        else
            this.maxSize = 30;
        this.heap = new MaxHeap()
    }

    push(data, priority) {
        if (this.heap.size() < this.maxSize)
            this.heap.push(data, priority);
        else
            throw new Error("Max size already reached.");
    }

    shift() {
        if (this.heap.isEmpty())
            throw new Error("Queue is empty!");

        return this.heap.pop();
    }

    size() {
        return this.heap.size();
    }

    isEmpty() {
        return this.heap.isEmpty();
    }
}

module.exports = PriorityQueue;
