class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config)
            throw Error('Config not passed!');
        this.config = config;
        this.reset();
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.history[this.stepsCount];
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (!this.config.states[state])
            throw Error('State does not exist.');
        if (this.stepsCount < this.history.length - 1)
            // We are not on last position of history. Posterior history items become unactual, so we have remove them.
            this.history.splice(this.stepsCount + 1, this.history.length - this.stepsCount - 1);
        this.history.push(state);
        this.stepsCount++;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let newState = this.config.states[this.getState()].transitions[event];
        if (!newState)
            throw Error('Wrong event.')
        this.changeState(newState);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.history = [this.config.initial];
        this.stepsCount = 0;
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let result = [];
        if (!event)
            for (let stateName in this.config.states)
                result.push(stateName);
        else
            for (let stateName in this.config.states)
                if (this.config.states[stateName].transitions[event])
                    result.push(stateName);
        return result;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        return this.stepsCount ? (this.stepsCount--, true) : false;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        return this.stepsCount < this.history.length - 1 ? (this.stepsCount++, true) : false;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [this.history[this.stepsCount]];
        this.stepsCount = 0;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
