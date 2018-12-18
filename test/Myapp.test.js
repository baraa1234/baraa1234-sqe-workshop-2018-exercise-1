import assert from 'assert';
import {extract} from '../src/js/Myapp';
import {parseCode} from '../src/js/code-analyzer';



let t1 = ()=>{
    let output = extract(parseCode('function fun() { }'));
    assert.equal(JSON.stringify(output),'[{"line":"1","type":"function declaration","name":"fun","cond":"","value":""}]');

};

let t2 = ()=>{
    let output = extract(parseCode('function fun(x,y) { return x;}'));
    assert.equal(JSON.stringify(output),'[{"line":"1","type":"function declaration","name":"fun","cond":"","value":""},{"line":"1","type":"variable declaration","name":"x","cond":"","value":""},{"line":"1","type":"variable declaration","name":"y","cond":"","value":""},{"line":"1","type":"return statement","name":"","cond":"","value":"x"}]');



};


let t3 = ()=>{
    let output = extract(parseCode('function fun(x,y,z) { return (x + y + z)/x ;}'));
    assert.equal(JSON.stringify(output),'[{"line":"1","type":"function declaration","name":"fun","cond":"","value":""},{"line":"1","type":"variable declaration","name":"x","cond":"","value":""},{"line":"1","type":"variable declaration","name":"y","cond":"","value":""},{"line":"1","type":"variable declaration","name":"z","cond":"","value":""},{"line":"1","type":"return statement","name":"","cond":"","value":"( ( ( x + y ) + z ) / x )"}]');
};

let t4 = ()=>{
    let output = extract(parseCode('let x;'));
    assert.equal(JSON.stringify(output),'[{"line":"1","type":"variable declaration","name":"x","cond":"","value":"null"}]');

};

let t5 = ()=>{
    let output = extract(parseCode('let x = 5;'));
    assert.equal(JSON.stringify(output),'[{"line":"1","type":"variable declaration","name":"x","cond":"","value":"5"}]');

};

let t6 = ()=>{
    let output = extract(parseCode('let x = 5,y,z = 4;'));
    assert.equal(JSON.stringify(output),'[{"line":"1","type":"variable declaration","name":"x","cond":"","value":"5"},{"line":"1","type":"variable declaration","name":"y","cond":"","value":"null"},{"line":"1","type":"variable declaration","name":"z","cond":"","value":"4"}]');

};

let t7 = ()=>{
    let output = extract(parseCode('while(x < 5){i = i+ 1;}'));
    assert.equal(JSON.stringify(output),'[{"line":"1","type":"while statement","name":"","cond":"( x < 5 )","value":""},{"line":"1","type":"assignment expression","name":"i","cond":"","value":"( i + 1 )"}]');

};

let t8 = ()=>{
    let output = extract(parseCode('let x = (1 + 2)/(2*3) + 4'));
    assert.equal(JSON.stringify(output),'[{"line":"1","type":"variable declaration","name":"x","cond":"","value":"( ( ( 1 + 2 ) / ( 2 * 3 ) ) + 4 )"}]');

};

let t9 = ()=>{
    let output = extract(parseCode('if(y < 3) 5;'));
    assert.equal(JSON.stringify(output),'[{"line":"1","type":"if statement","name":"","cond":"( y < 3 )","value":""}]');

};
let t10 = ()=>{
    let output = extract(parseCode('if(y < 3) 5; else 5;'));
    assert.equal(JSON.stringify(output),'[{"line":"1","type":"if statement","name":"","cond":"( y < 3 )","value":""},{"line":"1","type":"else statement","name":"","cond":"","value":""}]');

};

let t11 = ()=>{
    let output = extract(parseCode('if(y < 3) {5;} else {5;}'));
    assert.equal(JSON.stringify(output),'[{"line":"1","type":"if statement","name":"","cond":"( y < 3 )","value":""},{"line":"1","type":"else statement","name":"","cond":"","value":""}]');
};

let t12 = ()=>{
    let output = extract(parseCode('if(y < 3) {5;} else if (y == 3){5;} else 5;'));
    assert.equal(JSON.stringify(output),'[{"line":"1","type":"if statement","name":"","cond":"( y < 3 )","value":""},{"line":"1","type":"else if statement","name":"","cond":"( y == 3 )","value":""},{"line":"1","type":"else statement","name":"","cond":"","value":""}]');

};
let t13 = ()=>{
    let output = extract(parseCode('for(i = 0  ; i < a[b] ; i++){let x = 1; y = 5;}'));
    assert.equal(JSON.stringify(output),'[{"line":"1","type":"for statement","name":"","cond":"i=0;( i < a[b] );i++","value":""},{"line":"1","type":"variable declaration","name":"x","cond":"","value":"1"},{"line":"1","type":"assignment expression","name":"y","cond":"","value":"5"}]');

};
let t14 = ()=>{
    let output = extract(parseCode('function fun(){ y = y; return -1;}'));
    assert.equal(JSON.stringify(output),'[{"line":"1","type":"function declaration","name":"fun","cond":"","value":""},{"line":"1","type":"assignment expression","name":"y","cond":"","value":"y"},{"line":"1","type":"return statement","name":"","cond":"","value":"-1"}]');

};

let t15 = ()=>{
    let output = extract(parseCode('let x = x++; let x = --x;'));
    assert.equal(JSON.stringify(output),'[{"line":"1","type":"variable declaration","name":"x","cond":"","value":"x++"},{"line":"1","type":"variable declaration","name":"x","cond":"","value":"--x"}]');

};

describe('The javascript parser', () => {
    it('paramterless function', t1);
    it('function with parameter ,normal return', t2);
    it('function with parameter ,complex return', t3);
    it('single var delaration , no value', t4);
    it('single var delaration , with value', t5);
    it('multiple var delarations , with\\without value', t6);
    it('simple loop', t7);
    it('complex assignment expression', t8);
    it('if statement without block, without else', t9);
    it('if statement without block, with else', t10);
    it('if statement with block, with Blocked else', t11);
    it('clustered if else', t12);
    it('simple for loop',t13);
    it('return an unary expression',t14);
    it('UpdateExpressions',t15);


});

