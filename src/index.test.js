import expect from 'expect';
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import reactHtmlReplace from './index';

// POLYFILL FOR NODE < 11
if (!Array.prototype.flat) {
    Array.prototype.flat = function(depth) {
      var flattend = [];
      (function flat(array, depth) {
        for (let el of array) {
          if (Array.isArray(el) && depth > 0) {
            flat(el, depth - 1);
          } else {
            flattend.push(el);
          }
        }
      })(this, Math.floor(depth) || 1);
      return flattend;
    };
}

const Mention = props => {
    const { children, id, name } = props;
    return (
      <span name={name} id={id} style={{ border: '1px solid #ccc' }}>
        &nbsp;{children}&nbsp;
      </span>
    );
  };

const matchTags = (tag, props) => {
    if (tag === 'bold') {
      return <b />;
    }
    if (tag === 'italic') {
      return <i />;
    }
    if (tag === 'br') {
      return <br></br>;
    }
    if (tag === 'mention') {
        const { name, id } = props;
        return <Mention name={name} id={id}></Mention>;
      }
    if (tag === 'hashtag') {
        const { tag, href } = props;
        return <a href={href}>{`#${tag}`}</a>;
      }
  };

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

const render = (html) => {
    act(() => {
        ReactDOM.render(reactHtmlReplace(html, matchTags), container);
    });
};

describe('parseText', () => {
  it('should render demo sample', () => {
    render('<italic>This is <bold>xml string</bold> with custom nested markup, <bold>we can get inner markup & attributes through props.</bold></italic> <mention id="123" name="raodurgesh"> this is mention tag with id & name attributes</mention> <hashtag tag="howdymody" href="http://google.com"></hashtag>');

    expect(container.innerHTML).toEqual('<i>This is <b>xml string</b> with custom nested markup, <b>we can get inner markup &amp; attributes through props.</b></i><span name="raodurgesh" id="123" style="border: 1px solid rgb(204, 204, 204);">&nbsp; this is mention tag with id &amp; name attributes&nbsp;</span> <a href="http://google.com">#howdymody</a>')
  });

  it('should render demo sample with line break', () => {
    render('<italic>This is <bold>xml string</bold> with custom nested markup, <bold>we can get inner markup & attributes through props.</bold></italic><br /><mention id="123" name="raodurgesh"> this is mention tag with id & name attributes</mention> <hashtag tag="howdymody" href="http://google.com"></hashtag>');

    expect(container.innerHTML).toEqual('<i>This is <b>xml string</b> with custom nested markup, <b>we can get inner markup &amp; attributes through props.</b></i><br><span name="raodurgesh" id="123" style="border: 1px solid rgb(204, 204, 204);">&nbsp; this is mention tag with id &amp; name attributes&nbsp;</span> <a href="http://google.com">#howdymody</a>')
  })
})
