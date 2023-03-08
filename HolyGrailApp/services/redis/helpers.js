const rClient = require('./initialize');

const init_data = {
    header: 0,
    left: 0,
    right: 0,
    article: 0,
    footer: 0
  };

/**
 *  Approach 1: To ADD and UPDATE data in Redis adhering to problem statement mentioned in the document.
 * 
 *  - Use the Redis client to initialize values for header, left, article, right, and footer. 
 *    These values should be "header", 0, "left", 0, "article", 0, "right", 0, "footer", 0
 *     
 *  - You should first locate the records matching the provided key and then update it to 
 *    the new provided value.
 * 
 * 
 *  - Approach: To set individual keys to store their respective values. 
 *   
 *  - Downside: O(n) read and write operations.
 * 
 */

// Util functions.
const validKeys = ['header', 'left', 'right', 'article', 'footer'];
const validKey = (key) => validKeys.includes(key); 

const getSetUpdateKey = async (key, value=0, strict=false) => {
    if(!strict) {
        const data = await rClient.get(key);
        if(data) return Number(data);
    }
    const update = await rClient.set(key, value);
    console.log('update ', update);
    return (update === 'OK') ? Number(value) : 0;
} 

// TODO: initialize values for: header, left, right, article and footer using the redis client
// const header = await getSetUpdateKey('header');
// const left = await getSetUpdateKey('left');
// const right = await getSetUpdateKey('right');
// const article = await getSetUpdateKey('article');
// const footer = await getSetUpdateKey('footer');


const dataApOne = async () => {
    try {
    
        const [ header, left, right, article, footer ] = await Promise.all([ 
            getSetUpdateKey('header'), 
            getSetUpdateKey('left'), 
            getSetUpdateKey('right'), 
            getSetUpdateKey('article'), 
            getSetUpdateKey('footer') 
        ]);
    
        return {
            header, left, right, article, footer
        };
    } catch (err) {
        console.log('Caught an exception while retrieving data from redis. Details: ', err);
        return init_data;
    }
}


const updateApOne = async (key, val) => {
    try {
        const data = await dataApOne(key);
        
        // If this condition fails we should throw a badrequest error. To adhere with the best practises.
        if(!validKey(key)) return data;

        const update = await getSetUpdateKey(key, val, true);
        if(update) return { ...data, [key]:val };
        return data;
    } catch (err) {
        console.log('Caught an exception while updating data on redis. Details: ', err);
        return init_data;
    }
}


/**
 * 
 *    Approach 2:  Store the values as an object (JSON.stringify) in a single key.
 *      for example: key = 'data'
 *                   value = { header: 0, left: 0, right: 0, article: 0, footer: 0 }
 *  
 * 
 *    Benefits: Constant time complexity. i.e.: Reterive O(1), Update O(1)
 * 
 */


const getSetUpdateKey_APTwo = async (key, value=init_data, strict=false) => {
    if(!strict) {
        const data = await rClient.get(key);
        if(data) return JSON.parse(data);
        return init_data;
    }
    const update = await rClient.set(key, value);
    return (update === 'OK') ? JSON.parse(value) : 0;
} 



const dataApTwo = async () => {
    try {
        const rData = await getSetUpdateKey_APTwo('data');
        if(rData) return rData;
        return init_data;
    } catch (err) {
        console.log('Caught an exception while retrieving data from redis. Details: ', err);
        return init_data;
    }
}


const updateApTwo = async (key, val) => {
    try {
        const data = await dataApTwo('data');
        
        // If this condition fails we should throw a badrequest error. To adhere with the best practises.
        if(!validKey(key)) return data;

        const update = await getSetUpdateKey_APTwo('data', JSON.stringify({...data, [key]: val }), true);
        if(update) return { ...data, [key]:val };
        return data;
    } catch (err) {
        console.log('Caught an exception while updating data on redis. Details: ', err);
        return init_data;
    }
}




/**
 * 
 *    Approach 3: To store the values in a Hash.
 *      for example: key = 'hdata'
 *                   value = { header: 0, left: 0, right: 0, article: 0, footer: 0 }
 *  
 * 
 *    Benefits: Constant time complexity. i.e.: Reterive O(1), Update O(1), Initialize O(n)
 * 
 */



const getSetUpdateKey_APThree = async (key, field, value=0, strict=false) => {
    try {
        if(!strict) {
            const { header, left, right, article, footer } = await rClient.hGetAll(key);
            return {
                header: header ? Number(header) : 0,
                left: left ? Number(left) : 0,
                right: right ? Number(right) : 0,
                article: article ? Number(article) : 0,
                footer: footer ? Number(footer) : 0,
            };
        }

        const update = await rClient.hSet(key, field, value);
        return (update == 1 || update == 0) ? value : 0;

    } catch (err) {
        console.error('Caught an exception while processing hash in redis. Details: ', err);
        return init_data;
    }
} 



(async () => {
    if(!(await rClient.exists('hdata'))) {
        const data = await Promise.all([ 
            getSetUpdateKey_APThree('hdata', 'header', 0, true), 
            getSetUpdateKey_APThree('hdata', 'left', 0, true), 
            getSetUpdateKey_APThree('hdata', 'right', 0, true), 
            getSetUpdateKey_APThree('hdata', 'article', 0, true), 
            getSetUpdateKey_APThree('hdata', 'footer', 0, true) 
        ]);
        return data;
    }
})();



const dataApThree = async () => {
    try {
        const rData = await getSetUpdateKey_APThree('hdata');
        if(rData) return rData;
        return init_data;
    } catch (err) {
        console.log('Caught an exception while retrieving hdata from redis. Details: ', err);
        return init_data;
    }
}


const updateApThree = async (key, val) => {
    try {
        const data = await dataApThree('hdata');

        // If this condition fails we should throw a badrequest error. To adhere with the best practises.
        if(!validKey(key)) return data;

        const update = await getSetUpdateKey_APThree('hdata', key, JSON.stringify(val), true);
        if(update) return { ...data, [key]:val };
        return data;
    } catch (err) {
        console.log('Caught an exception while updating hdata on redis. Details: ', err);
        return init_data;
    }
}



module.exports = {
    init_data,
    dataApOne, updateApOne,
    dataApTwo, updateApTwo,
    dataApThree, updateApThree
};