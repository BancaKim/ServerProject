test();

function test(){
    setTimeout(function (){
        console.log('1초만 기다려');
    }, 1000)

    for(var i=0; i<10; i++){
        console.log(i);
    }
}
// console.log("================")
// start(first);
// start(second);

// start(val=>{
//     console.log('where')
//     console.log('first=',val);
// })

// function start(abc) {
//     console.log('start');
//     let val = 100;
//     abc(val);
// }

// function first() {
//     console.log('first');
// }

// function second(){
//     console.log('second');
// }



function promise(){
    return new Promise((resolve, reject) => {

        setTimeout(function() {
            console.log('start');
            resolve('data');
        },1000);
    })
};

first();
async function first(){
    let data = await promise();
    console.log(data);
}
