import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {extract} from './Myapp';

function add_row(row) {
    let table =$('#MyBody');
    table.append('<tr>');
    table.append('<td>'+row.line+'</td>');
    table.append('<td>'+row.type+'</td>');
    table.append('<td>'+row.name+'</td>');
    table.append('<td>'+row.cond+'</td>');
    table.append('<td>'+row.value+'</td>');
    table.append('</tr>');

}

function refresh(){

    $('#MyTable > tbody').empty();
}
$(document).ready(function () {

    $('#codeSubmissionButton').click(() => {
        refresh();
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#codePlaceholder').val(JSON.stringify(parsedCode));
        let rows = extract(parsedCode);
        rows.forEach(function(element){
            add_row(element);
        });
    });
});
