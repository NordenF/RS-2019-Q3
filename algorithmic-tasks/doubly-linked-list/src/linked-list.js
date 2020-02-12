const Node = require('./node');


class LinkedList {
    constructor() {
        this.clear();
    }

    append(data) {
        let node = new Node(data, this._tail);
        if (this._tail)
            this._tail.next = node;
        this._tail = node;
        if (!this._head)
            this._head = node;
        this.length++;
        return this;
    }

    head() {
        return this._head ? this._head.data : null;
    }

    tail() {
        return this._tail ? this._tail.data : null;
    }

    _getNode(index) {
        let node, i;
        for (node = this._head, i = 0; node && i < index; node = node.next, i++)
            ;
        return node;
    }

    at(index) {
        let node = this._getNode(index);
        return node ? node.data : null;
    }

    insertAt(index, data) {
        let node = this._getNode(index);
        if (node) {
            let newNode = new Node(data, node.prev, node)
            if (node.prev) {
                node.prev.next = newNode;
            } else {
                this._head = newNode;
            }
            node.prev = newNode;
        } else {
            this.append(data);
        }
        this.length++;
        return this;
    }

    isEmpty() {
        return !this._head;
    }

    clear() {
        this._head = null;
        this._tail = null;
        this.length = 0;
        return this;
    }

    deleteAt(index) {
        let node = this._getNode(index);
        if (!node)
            return this;
        if (node.prev)
            node.prev.next = node.next;
        else
            this._head = node.next;
        if (node.next)
            node.next.prev = node.prev;
        else
            this._tail = node.prev;
        this.length--;
        return this;
    }

    reverse() {
        if (!this._head)
            return this;

        for (let node = this._head; node; node = node.prev) {
            let temp = node.next;
            node.next = node.prev;
            node.prev = temp;
        }

        let temp = this._tail;
        this._tail = this._head;
        this._head = temp;

        return this;
    }

    indexOf(data) {
        for (let node = this._head, i = 0; node; node = node.next, i++)
            if (node.data === data)
                return i;
        return -1;
    }
}


module.exports = LinkedList;
