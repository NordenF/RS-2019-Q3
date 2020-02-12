class Node {
    constructor(data, priority) {
        this.data = data;
        this.priority = priority;
        this.parent = null;
        this.left = null;
        this.right = null;
    }

    isFull() {
    	// Both two childs of the node are exist;
        return this.left && this.right;
    }

    appendChild(node) {
        if (!this.left) {
            this.left = node;
            node.parent = this;
        } else if (!this.right) {
            this.right = node;
            node.parent = this;
        }
    }

    removeChild(node) {
        if (!node)
            return;

        if (this.left === node) {
            this.left = null;
            node.parent = null;
        } else if (this.right === node) {
            this.right = null;
            node.parent = null;
        } else
            throw new Error("The specified node is not a child of this node.")
    }

    remove() {
        if (!this.parent)
            return;

        this.parent.removeChild(this);
    }

    swapWithParent() {
        let parent = this.parent;
        if (!parent)
            return;

        let oldParentOfParent = parent.parent;
        parent.parent = this;
        this.parent = oldParentOfParent;
        if (oldParentOfParent)
            if (oldParentOfParent.left === parent)
                oldParentOfParent.left = this;
            else  // oldParentOfParent.right === parent
                oldParentOfParent.right = this;

        let oldMyLeftChild = this.left;
        let oldMyRightChild = this.right;
        if (parent.left === this) {
            this.left = parent;
            this.right = parent.right;
            if (this.right)
                this.right.parent = this;
        } else {  // parent.right === this
            this.right = parent;
            this.left = parent.left;
            if (this.left)
                this.left.parent = this;
        }
        parent.left = oldMyLeftChild;
        parent.right = oldMyRightChild;
        if (parent.left)
            parent.left.parent = parent;
        if (parent.right)
            parent.right.parent = parent;
    }
}

module.exports = Node;
