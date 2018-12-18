
function makerow(line,type,name,cond,val){
    return {line :line , type:type , name :name ,cond :cond ,value:val};
}
function  myflat(arr)
{
    return arr.reduce((acc,element)=> acc.concat(element),[]);

}
let unparse_literal = lit => lit.raw;
let unparse_identifier = id => id.name;
let unparse_binaryexpression = be => '( ' + UnParse_BinaryExpression(be.left) + ' ' + be.operator + ' ' + UnParse_BinaryExpression(be.right) + ' )';
let unparse_memberexpression = me =>UnParse_BinaryExpression(me.object) + '[' + UnParse_BinaryExpression(me.property)+']';
let unparse_updateexpression = ue =>{
    let a = [ue.operator,UnParse_BinaryExpression(ue.argument)];
    return ue.prefix?a[0] + a[1]:a[1]+a[0];};
let unparse_assignmentexpressoin = ae => UnParse_BinaryExpression(ae.left) + ae.operator + UnParse_BinaryExpression(ae.right);
let unparse_unaryexpressoin = une => une.operator + UnParse_BinaryExpression(une.argument);
let b =
    {
        'Literal':unparse_literal,
        'Identifier':unparse_identifier,
        'AssignmentExpression':unparse_assignmentexpressoin,
        'BinaryExpression':unparse_binaryexpression,
        'MemberExpression':unparse_memberexpression,
        'UpdateExpression':unparse_updateexpression,
        'UnaryExpression' : unparse_unaryexpressoin
    };
//this function takes a BinaryExpression node and unparse it
function UnParse_BinaryExpression(init)
{
    return init == null?'null':b[init.type](init);
}
function extract_rows_from_vd(VD)
{
    let declerations = VD.declarations;
    return declerations.map((declaration)=> makerow(
        (declaration.id.loc.start.line).toString(),
        'variable declaration',
        declaration.id.name,
        '',
        UnParse_BinaryExpression(declaration.init)
    ));
}


function extract_rows_from_ES(ES)
{
    let AE = ES.expression;
    return AE.type =='AssignmentExpression' ? [makerow(AE.left.loc.start.line.toString(),
        'assignment expression',
        AE.left.name,
        '',
        UnParse_BinaryExpression(AE.right))]:[];
}


function extract_rows_from_RE(RE)
{
    return [makerow(RE.loc.start.line.toString(),
        'return statement',
        '',
        '',
        UnParse_BinaryExpression(RE.argument))];
}



function extract_rows_from_IS(IS)
{
    let head = makerow(IS.loc.start.line.toString(),
        'if statement',
        '',
        UnParse_BinaryExpression(IS.test),
        '');
    let consequent = extract_rows(IS.consequent);
    let alt = IS.alternate ===null? null :extract_rows(IS.alternate);
    let alternate = alt === null? []:
        (alt.length > 0)&&alt[0].type === 'if statement' ? add_else(alt):
            [makerow(IS.alternate.loc.start.line.toString(),'else statement','','','')].concat(alt);

    return [head].concat(consequent,alternate);

}
let add_else = arr=>[makerow(arr[0].line,'else if statement','',arr[0].cond,'')].concat(arr.slice(1));

function extract_rows_from_WS(WS)
{
    let head = makerow(WS.loc.start.line.toString(),
        'while statement',
        '',
        UnParse_BinaryExpression(WS.test),
        '');
    let rest = myflat((WS.body.body).map(extract_rows));
    return [head].concat(rest);
}


function extract_rows_from_FS(FS)
{
    let head = makerow(FS.loc.start.line.toString(),
        'for statement',
        '',
        UnParse_BinaryExpression(FS.init)+';'+UnParse_BinaryExpression(FS.test) +';'+ UnParse_BinaryExpression(FS.update),
        '');
    let rest = myflat((FS.body.body).map(extract_rows));
    return [head].concat(rest);
}
function extract_rows_from_FD(FD)
{
    let head = makerow(FD.loc.start.line.toString(),
        'function declaration',
        FD.id.name,
        '',
        '');
    let params = FD.params.map((param)=>makerow(
        param.loc.start.line.toString(),
        'variable declaration',
        param.name,
        '',''));
    let rest = myflat((FD.body.body).map(extract_rows));
    return [head].concat(params,rest);
}
function  extract_rows_from_bs(BS)  {
    return myflat((BS.body).map(extract_rows));
}


let A = {
    'VariableDeclaration':extract_rows_from_vd,
    'BlockStatement' : extract_rows_from_bs,
    'ExpressionStatement':extract_rows_from_ES,
    'ReturnStatement':extract_rows_from_RE,
    'IfStatement':extract_rows_from_IS,
    'WhileStatement':extract_rows_from_WS,
    'ForStatement' : extract_rows_from_FS,
    'FunctionDeclaration' : extract_rows_from_FD};


function extract_rows (exp)
{
    return  A[exp.type](exp);
}
function extract(parsedCode)
{
    return myflat((parsedCode.body).map(extract_rows));
}
export {extract,extract_rows};