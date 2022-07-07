import * as Vue from './vue.js';
import { selectedImage } from './components/selectedImage.js';
import { comments } from './components/comments.js';

const app = Vue.createApp({
    components: {
        'selected-image': selectedImage,
        'selected-coments': comments,
    },
    data() {
        return {
            showUploadForm: false,
            images: [],
            lowestIdOnScreen: null,
            lowestIdOnTable: null,
            showMoreBtn: null,
            selectedPicId: null,
            selectedPic: null,
            username: '',
            title: '',
            description: '',
            file: null,
            historyPath: '',
        };
    },
    mounted() {
        //addEventListener here is by default windown.addEventListener. No need to write it.
        addEventListener('popstate', () => {
            console.log('THIS', this);
            const id = location.pathname.slice(1);
            this.selectedPicId = id;
            console.log(
                'event listener',
                typeof this.selectedPicId,
                this.selectedPicId
            );
        });

        fetch('images.json')
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                console.log(res);
                this.images = res;
                const index = this.images.length - 1;
                this.lowestIdOnScreen = this.images[index].id;
                this.lowestIdOnTable = this.images[0].lowestId;
            });

        this.selectedPicId = Number.parseInt(location.pathname.slice(1));
    },
    watch: {
        lowestIdOnScreen(newlowestIdOnScreen) {
            if (newlowestIdOnScreen <= this.lowestIdOnTable) {
                this.showMoreBtn = false;
            } else {
                this.showMoreBtn = true;
            }
        },

        // selectedPicId(newselectedPicId) {
        //     console.log('been here', newselectedPicId);
        //     console.log('TYPEEEEE', typeof newselectedPicId);
        //     if (newselectedPicId != '') {
        //         console.log('been here too');

        //         fetch(`image/${newselectedPicId}`)
        //             .then((result) => {
        //                 return result.json();
        //             })
        //             .then((result) => {
        //                 this.selectedPic = result[0];
        //                 history.pushState({}, '', `/${newselectedPicId}`);
        //                 console.log(this.selectedPicId);
        //             });
        //     }
        // },
    },
    methods: {
        showForm() {
            this.showUploadForm = !this.showUploadForm;
        },
        closeForm() {
            this.showUploadForm = false;
            this.username = '';
            this.title = '';
            this.description = '';
            this.file = '';
        },
        uploadData(evt) {
            if (evt.target.name === 'username') {
                this.username = evt.target.value;
            }
            if (evt.target.name === 'title') {
                this.title = evt.target.value;
            }
            if (evt.target.name === 'description') {
                this.description = evt.target.value;
            }
            if (evt.target.name === 'file') {
                this.file = evt.target.files[0];
            }
        },

        handleUploadReq(evt) {
            evt.preventDefault();
            const formData = new FormData();
            formData.append('username', this.username);
            formData.append('title', this.title);
            formData.append('description', this.description);
            formData.append('file', this.file);

            fetch('/upload', {
                method: 'POST',
                body: formData,
            })
                .then((res) => res.json())
                .then((res) => {
                    this.images.unshift(res);
                    this.showUploadForm = false;
                    this.username = '';
                    this.title = '';
                    this.description = '';
                    this.file = null;
                });
        },
        getMoreImages() {
            fetch(`/moreImages/${this.lowestIdOnScreen}`)
                .then((result) => {
                    return result.json();
                })
                .then((result) => {
                    return result.forEach((img) => {
                        this.images.push(img);
                    });
                })
                .then(() => {
                    const index = this.images.length - 1;
                    this.lowestIdOnScreen = this.images[index].id;
                    this.lowestIdOnTable = this.images[0].lowestId;
                });
        },
        updateSelectedPicId(id) {
            this.selectedPicId = id;
            history.pushState({}, '', `/${id}`);
        },

        // popUpImage(id) {
        //     fetch(`image/${id}`)
        //         .then((result) => {
        //             return result.json();
        //         })
        //         .then((result) => {
        //             this.selectedPic = result[0];
        //             history.pushState({}, '', `/${id}`);
        //             this.selectedPicId = id;
        //             console.log(this.selectedPicId);
        //         });
        // },
        onClose() {
            this.selectedPic = null;
            history.pushState({}, '', `/`);
            this.selectedPicId = '';
            console.log(this.selectedPicId);
        },
    },
});

app.mount('#page');
