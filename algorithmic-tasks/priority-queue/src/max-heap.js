const Node = require('./node');

class MaxHeap {
    constructor(rule) {
        this.rule = rule || function (childNode, parentNode) {
            return childNode.priority <= parentNode.priority;
        };
        this.clear();
    }

    push(data, priority) {
        let newNode = new Node(data, priority);
        this.insertNode(newNode);
        this.shiftNodeUp(newNode);
    }

    pop() {
        if (this.isEmpty())
            return;

        let detachedRoot = this.detachRoot();
        this.count--;
        this.restoreRootFromLastInsertedNode(detachedRoot);
        this.shiftNodeDown(this.root);
        return detachedRoot.data;
    }

    detachRoot() {
        let root = this.root;
        if (!root)
            return null;

        let index = this.parentNodes.indexOf(root);
        if (index !== -1)
            this.parentNodes.splice(index, 1);

        if (root.left)
            root.left.parent = null;
        if (root.right)
            root.right.parent = null;

        this.root = null;
        return root;
    }

    restoreRootFromLastInsertedNode(detached) {
        if (!detached)
            throw new Error("Panic! Missing detached parameter.")

        if (!this.parentNodes.length)
            return;

        let lastInsertedNode = this.parentNodes.pop();
        let lastInsertedNodeParent = lastInsertedNode.parent;
        let isParentWasFull = lastInsertedNodeParent && lastInsertedNodeParent.isFull();
        lastInsertedNode.remove();
        if (isParentWasFull)
            // Now parent is not full. So, we should add it to parentNodes:
            this.parentNodes.unshift(lastInsertedNodeParent);

        this.root = lastInsertedNode;

        if (detached.left && detached.left !== lastInsertedNode) {
            lastInsertedNode.left = detached.left;
            lastInsertedNode.left.parent = lastInsertedNode;
        }
        if (detached.right && detached.right !== lastInsertedNode) {
            lastInsertedNode.right = detached.right;
            lastInsertedNode.right.parent = lastInsertedNode;
        }
        if (!lastInsertedNode.isFull())
            this.parentNodes.unshift(lastInsertedNode);
    }

    size() {
        return this.count;
    }

    isEmpty() {
        return !this.root;
    }

    clear() {
        this.count = 0;
        this.root = null;
        this.parentNodes = [];
    }

    insertNode(node) {
        if (this.isEmpty()) {
            this.root = node;
            this.parentNodes = [node];
            this.count++;
            return;
        }

        let parentNode = this.parentNodes[0];
        if (parentNode.isFull())
            throw new Error("Panic! Expected not filled node.")
        parentNode.appendChild(node);
        if (parentNode.isFull())
            // ParentNodes contains only not full nodes.
            this.parentNodes.shift();

        // We are sure that the last added node is not full.
        this.parentNodes.push(node);
        this.count++;
    }

    _changeLinksInParentNodes(node1, node2) {
        let node1Index = this.parentNodes.indexOf(node1);
        let node2Index = this.parentNodes.indexOf(node2);

        if (node1Index !== -1)
            this.parentNodes[node1Index] = node2;

        if (node2Index !== -1)
            this.parentNodes[node2Index] = node1;
    }

    shiftNodeUp(node) {
        let parent = node.parent
        if (!parent)
            return;

        if (this.rule(node, parent))
            return;

        node.swapWithParent();
        if (!node.parent)
            this.root = node;

        this._changeLinksInParentNodes(node, parent);

        this.shiftNodeUp(node);
    }

    shiftNodeDown(node) {
        if (!node)
            return;

        let left = node.left;
        let right = node.right;
        if (!left && !right)
            return;

        let nodeForSwap = null;

        if (left && right)
            nodeForSwap = this.rule(left, right) ? right : left;
        else
            nodeForSwap = left || right;

        if (this.rule(nodeForSwap, node))
        // Greatest child node is less of current node. Nothing to do.
            return;

        nodeForSwap.swapWithParent();
        if (!nodeForSwap.parent)
            this.root = nodeForSwap;


        this._changeLinksInParentNodes(nodeForSwap, node);

        this.shiftNodeDown(node);
    }
}

module.exports = MaxHeap;
