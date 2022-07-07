export const selectedImage = {
    props: ['id'],
    template: `<div id="shadow">
    <div id="selectedImage">
        <img id="closeIcon" src="/closeIcon.png" @click="onCloseClick">
        <div v-if="selectedPic">
        <img id="imgSel" :src="selectedPic.url">
        <div id="imgDetails">
        <h4>{{ selectedPic.title }}</h4>
        <p>{{ selectedPic.description }}</p>
        <p id="username">Uploaded by {{ selectedPic.username }} on {{ formatDate(selectedPic.created_at) }}</p>
        </div>
    </div>
    <div v-else>Ops, image not found!</div>
    </div>
</div>`,
    methods: {
        formatDate(date) {
            return new Date(date).toLocaleString();
        },
        onCloseClick() {
            this.$emit('close');
        },
    },
    mounted() {
        console.log('selected img mounte', this.id);
        fetch(`image/${this.id}`)
            .then((result) => {
                return result.json();
            })
            .then((result) => {
                if (this.selectedPic === []) {
                    this.selectedPic = null;
                } else {
                    this.selectedPic = result[0];
                }

                // history.pushState({}, '', `/${this.id}`);
                // // this.selectedPicId = id;
                console.log('result comp', result);
            });
    },
    data() {
        return {
            selectedPic: {
                id: '',
                url: '',
                created_at: '',
                description: '',
                username: '',
                title: '',
            },
        };
    },
};
