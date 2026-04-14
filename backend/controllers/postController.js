import prisma from "../config/db";

const createPost = async (req, res) => {
    try {
        const user = req.user; 
        
        if (!user || !user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { title, content } = req.body;

        const newPost = await prisma.post.create({
            data: {
                title: title,
                content: content,
                authorId: user.id,
            },
        });

        return res.status(201).json({ 
            success: true, 
            message: "Blog created successfully", 
            data: newPost 
        });

    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
}

const editPost = async (req, res) => {
    try {
        const user = req.user;
        const { postId } = req.params;
        const { title, content } = req.body;

        if (!user || !user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId, 10) } // CONVERTED TO INT
        });

        if (!post) {
            return res.status(404).json({ success: false, message: "No such post exists" });
        }

        if (post.authorId !== user.id) {
            return res.status(403).json({ success: false, message: "You can only edit your own posts" });
        }

        const updatedPost = await prisma.post.update({
            where: { id: parseInt(postId, 10) }, // CONVERTED TO INT
            data: {
                title: title,     
                content: content,
            },
        });

        return res.status(200).json({ 
            success: true, 
            message: "Post updated successfully", 
            data: updatedPost 
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

const deletePost = async (req, res) => {
    try {
        const user = req.user;
        const { postId } = req.params; 

        if (!user || !user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId, 10) } // CONVERTED TO INT
        });

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        if (post.authorId !== user.id) {
            return res.status(403).json({ success: false, message: "You can only delete your own posts" });
        }

        await prisma.post.delete({
            where: { id: parseInt(postId, 10) } // CONVERTED TO INT
        });

        return res.status(200).json({ success: true, message: "Post deleted successfully" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const user = req.user;
        
        if (!user || !user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const allPosts = await prisma.post.findMany({
            where: {
                authorId: user.id
            },
            orderBy: {
                createdAt: 'desc' 
            }
        });

        if (allPosts.length === 0) {
            return res.status(200).json({ 
                success: true, 
                message: "You haven't created any posts yet", 
                data: [] 
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Posts retrieved successfully", 
            data: allPosts 
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;
        
        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId, 10) }, 
            include: {
                author: {
                    select: { username: true, email: true } 
                }
            }
        });

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        return res.status(200).json({ success: true, data: post });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

const deleteAllPost = async (req, res) => {
    try {
        const user = req.user;

        if (!user || !user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const deletedRecords = await prisma.post.deleteMany({
            where: {
                authorId: user.id
            }
        });

        return res.status(200).json({ 
            success: true, 
            message: `${deletedRecords.count} posts deleted successfully` 
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};


export { 
    getAllPosts, 
    getPostById, 
    deleteAllPost, 
    deletePost, 
    createPost, 
    editPost 
};