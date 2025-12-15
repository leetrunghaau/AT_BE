

const createUuidv7 = async ()=>{
    const { v7: uuidv7 } = await import('uuid');
    return uuidv7();
}

module.exports = {
    createUuidv7
}