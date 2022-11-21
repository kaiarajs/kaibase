import { Schema } from "./schema"



function main() {
    const schema = {
        age: Schema.number().max(15),
        user: Schema.id().ref("User")
    }

    try {
      console.log('schema', schema)
      console.log('paresd', Object.keys(schema))
       const result = Schema.validate(schema, {age: 1, user: "wwe34ojor3j"});
        console.log('result',result)

        const tata = Object.keys(schema).reduce<Record<string, unknown>>(
          (prev, key) => {
            let ret = schema[key];
            if (ret != null) prev[key] = ret;
  
            return prev;
          },
          {},
        );
        console.log('tata', tata)
      } catch (error) {
        console.log(error)
      }
}


main()