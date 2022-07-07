export const comments = {
    props: ['id'],
    methods: {
        formatDate(date) {
            return new Date(date).toLocaleString();
        },

        uploadCommentData(evt) {
            if (evt.target.name === 'comment') {
                this.comment = evt.target.value;
            }
            if (evt.target.name === 'userComment') {
                this.userComment = evt.target.value;
            }
        },
        insertNewComment(evt) {
            evt.preventDefault();
            const body = {
                img_id: this.id,
                userComment: this.userComment,
                comment: this.comment,
            };
            const bodyJson = JSON.stringify(body);

            fetch('/new-comment', {
                method: 'POST',
                body: bodyJson,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((res) => res.json())
                .then((res) => {
                    this.commentsList.unshift(res);
                    this.showMessage = false;
                    this.userComment = '';
                    this.comment = '';
                });
        },
    },
    template: `<div id="com" >        
                    <div id="commentsBox">
                    <h5 v-if="showMessage">Be the first one to comment</h5>
                    <div id="comments" v-for="com in commentsList">
                        <h5>{{ com.comment }}</h5>
                        <p id="username">by {{ com.username }} on {{ formatDate(com.created_at) }}</p>
                    </div>
                </div>
                    <form @submit="insertNewComment">
                        <input type="text" name="comment" placeholder="Comment" v-model="comment" @change="uploadCommentData" required/>
                        <input type="text" name="userComment" placeholder="Username" v-model="userComment" @change="uploadCommentData" required/>
                        <button>Send</button>
                    </form>
                </div>`,
    data() {
        return {
            commentsList: [],
            comment: null,
            userComment: null,
            showMessage: false,
        };
    },
    mounted() {
        fetch(`get-comments/${this.id}`)
            .then((result) => {
                return result.json();
            })
            .then((result) => {
                this.commentsList = result;
                console.log('comments comp', result);
                if (result.length === 0) {
                    this.showMessage = true;
                }
            });
    },
};
