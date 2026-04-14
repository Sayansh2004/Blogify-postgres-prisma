import express from 'express';


import { 
    createPost, 
    editPost, 
    deletePost, 
    getAllPosts, 
    getPostById, 
    deleteAllPost 
} from '../controllers/postController.js'; 


import { verifyToken } from '../middleware/authMiddleware.js'; 

const postRouter = express.Router();


postRouter.post('/create', verifyToken, createPost);


postRouter.get('/all', verifyToken, getAllPosts);


postRouter.get('/:postId', getPostById);

postRouter.put('/edit/:postId', verifyToken, editPost);


postRouter.delete('/delete/:postId', verifyToken, deletePost);

postRouter.delete('/deleteAll', verifyToken, deleteAllPost);


export default postRouter;