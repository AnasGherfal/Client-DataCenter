// {
//     "users": [
//         {
//             "id": 1,
//             "name": "LTT",
//             "status": "نشط",
//             "email": "kok@ltt.ly",
//             "phoneNumber1":"0912121212",
//             "phoneNumber2":"0923232323",

//         }
//     ]
// }

module.exports = function(){
    var faker = require("faker");
    var _ = require("lodash");

    return { 
        users: _.times(100, function(n: number){
            return{
                id: n+1,
                name: faker.name.findName(),
                status: _.sample(["نشط","منتهي الصلاحية"]),
                email: faker.email.email(),
                address: faker.address.address(),
                phoneNumber1: faker.phoneNumber1.phoneNumber(),
                phoneNumber2: faker.phoneNumber2.phoneNumber(),

            }
        })

    }
}