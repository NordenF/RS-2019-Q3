/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  return Object.setPrototypeOf(obj, proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

/* eslint max-classes-per-file: ["error", 5] */
/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */

const cssSelectorDuplicationError = 'Element, id and pseudo-element should not occur more then one time inside the selector';
const cssSelectorPartsOrderError = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';

class CssSelector {
  element(value) {
    if (this._element) {
      throw new Error(cssSelectorDuplicationError);
    }
    if (this._id || this._classesSet || this._attributesSet
      || this._pseudoClassesSet || this._pseudoElement) {
      throw new Error(cssSelectorPartsOrderError);
    }
    this._element = value;
    return this;
  }

  id(value) {
    if (this._id) {
      throw new Error(cssSelectorDuplicationError);
    }
    if (this._classesSet || this._attributesSet
      || this._pseudoClassesSet || this._pseudoElement) {
      throw new Error(cssSelectorPartsOrderError);
    }
    this._id = value;
    return this;
  }

  class(value) {
    if (this._attributesSet
      || this._pseudoClassesSet || this._pseudoElement) {
      throw new Error(cssSelectorPartsOrderError);
    }
    if (this._classesSet === undefined) {
      this._classesSet = new Set();
    }
    this._classesSet.add(value);
    return this;
  }

  attr(value) {
    if (this._pseudoClassesSet || this._pseudoElement) {
      throw new Error(cssSelectorPartsOrderError);
    }
    if (this._attributesSet === undefined) {
      this._attributesSet = new Set();
    }
    this._attributesSet.add(value);
    return this;
  }

  pseudoClass(value) {
    if (this._pseudoElement) {
      throw new Error(cssSelectorPartsOrderError);
    }
    if (this._pseudoClassesSet === undefined) {
      this._pseudoClassesSet = new Set();
    }
    this._pseudoClassesSet.add(value);
    return this;
  }

  pseudoElement(value) {
    if (this._pseudoElement) {
      throw new Error(cssSelectorDuplicationError);
    }
    this._pseudoElement = value;
    return this;
  }

  stringify() {
    const elStr = this._element || '';
    const id = this._id ? `#${this._id}` : '';
    const classList = this._classesSet ? (
      Array.from(this._classesSet).reduce((acc, cur) => `${acc}.${cur}`, '')
    ) : '';
    const attrList = this._attributesSet ? (
      Array.from(this._attributesSet).reduce((acc, cur) => `${acc}[${cur}]`, '')
    ) : '';
    const pseudoClassList = this._pseudoClassesSet ? (
      Array.from(this._pseudoClassesSet).reduce((acc, cur) => `${acc}:${cur}`, '')
    ) : '';
    const pseudoElement = this._pseudoElement ? `::${this._pseudoElement}` : '';

    return `${elStr}${id}${classList}${attrList}${pseudoClassList}${pseudoElement}`;
  }
}

class CssSelectorCombination {
  constructor(selector1, combinator, selector2) {
    if (!(selector1 && combinator && selector2)) {
      throw new Error('All selector1, combinator and selector2 should be specified!');
    }
    this.selector1 = selector1;
    this.selector2 = selector2;
    this.combinator = combinator;
  }

  stringify() {
    return `${this.selector1.stringify()} ${this.combinator} ${this.selector2.stringify()}`;
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new CssSelector().element(value);
  },

  id(value) {
    return new CssSelector().id(value);
  },

  class(value) {
    return new CssSelector().class(value);
  },

  attr(value) {
    return new CssSelector().attr(value);
  },

  pseudoClass(value) {
    return new CssSelector().pseudoClass(value);
  },

  pseudoElement(value) {
    return new CssSelector().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new CssSelectorCombination(selector1, combinator, selector2);
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
