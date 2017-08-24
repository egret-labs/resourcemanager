function testLoadZip() {


    RES.getResAsync("assets/armature/1.zip#assets/armature/skeleton.json")
        .then((result) => {
            console.log(result)
        })
}