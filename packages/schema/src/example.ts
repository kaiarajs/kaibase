import { Schema } from "./schema"



function main() {
    const schema = {
        age: Schema.number().max(15),
        user: Schema.id().ref("User")
    }

    try {
        const result = Schema.validate(schema, {age: 19});
        console.log('result',result)
      } catch (error) {
        console.log(error)
      }
}


main()