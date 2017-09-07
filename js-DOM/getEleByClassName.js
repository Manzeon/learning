/**
 * Created by Manzeon on 2017/7/15.
 */

function getElementsByClassName(node, classname) {
    if(node.getElementsByClassName){
        return node.getElementsByClassName(classname);
    } else {
        var results = new Array();
        var elems = node.getElementsByTagName("*");
        for (var i=0; i<elems.length; i++) {
            if (elems[i].className.indexOf(classname) != -1){
                results[results.length] = elems[i];
            }
        }
        return results;
    }
}

// var sales = getElementsByClassName(shopping, "sale");