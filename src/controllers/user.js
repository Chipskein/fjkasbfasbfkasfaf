const database = require('../config/db')
module.exports={

    async get(req,res){
        const search=req.query?.search || null
        const sort=req.query?.sort || null
        const status=req.query?.status || null
        const role=req.query?.role || null
        const limit = parseInt(req.query?.limit) || 10;
        const page = parseInt(req.query?.page) || 1;
        const offset = (page - 1) * limit;
        const totalUsers = database.users.length;
        let users = database.users.slice(offset, offset + limit);
        if (search){
            users = users.filter( u => 
                u.st_name.toLowerCase().includes(search.toLowerCase()) ||
                u.st_email.toLowerCase().includes(search.toLowerCase()) ||
                u.st_username.toLowerCase().includes(search.toLowerCase())
            )
        }
        if(role) users = users.filter( u => u.st_role.toLowerCase().includes(role.toLowerCase()))
        if(status) users = users.filter( u => u.st_status.toLowerCase().includes(status.toLowerCase()))
        if(sort){
            switch(sort.toLowerCase()){
                case "za":
                    users.sort((a, b) => b.st_name.localeCompare(a.st_name))
                    break
                
                case "az":
                    users.sort((a, b) => a.st_name.localeCompare(b.st_name))
                    break

                case "new":
                    users.sort((a,b)=>a.dt_created-b.dt_created)
                    break

                case "old":
                    users.sort((a,b)=>b.dt_created-a.dt_created)
                    break
            }
        }

        const totalPages = Math.ceil(totalUsers / limit);
        const hasNext = page < totalPages;
        const hasPrevious = page > 1;
        const pageNumbers = [];
        const startPage = Math.max(1, page - 2);
        const endPage = Math.min(totalPages, page + 2);
        for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
        return res.render("table",{
            users,
            pagination:{
                totalUsers,
                totalPages,
                currentPage: page,
                limit,
                hasNext,
                hasPrevious,
                startItem: Math.min(offset + 1, totalUsers),
                endItem: Math.min(offset + limit, totalUsers),
                pageNumbers,
                nextPage: page + 1,
                prevPage: page - 1
            }
        })
    },
    
    async renderSaveForm(req,res){
        const { user_id } = req.params
        let user = null
        if(user_id) user = database.users.find(u=>u.in_id = user_id)
        return res.render("user",{user})
    },

    async saveForm(req,res){
        const { user_id } = req.params
        const {
            st_name,
            st_email,
            st_password,
            st_confirm_password,
            st_role,
            st_status,
        } = req.body
        if(!st_name|| st_name.trim()=='') throw new Error("Nome invalido")
        if(!st_email|| st_email.trim()=='') throw new Error("Email invalido")
        if(st_password!==st_confirm_password) throw new Error("Senha não conferem")
        if(['active','invited','suspended'].includes(st_status.toLowerCase())) throw new Error("Status inválido")
        if(['manager','viewer','admin','editor'].includes(st_role.toLowerCase())) throw new Error("Role inválido")
        if(user_id){
            let index = database.users.findIndex(u=>u.in_id = user_id)
            let user  = database.users.find(u=>u.in_id = user_id)
            database.users[index]={
                ...user,
                st_name,
                st_email,
                st_password,
                st_role: st_role?.toLowerCase(),
                st_status: st_status?.toLowerCase(),
                dt_updated:new Date().toISOString()
            }
        } else{
            database.users.push({
                in_id:database.users.length,
                st_name,
                st_email,
                st_password,
                st_confirm_password,
                st_role,
                st_status,
                st_username:`@${st_name.toLowerCase()}`,
                st_sigla:`${st_name[0]}${st_name.split(" "),[1][1]}`,
                dt_created:new Date().toISOString(),
                dt_updated:new Date().toISOString(),
            })
        }

        return res.redirect("/users/")
    }
    
}