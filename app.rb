require 'sinatra'
require 'sinatra/activerecord'
require './environments'
require 'sinatra/flash'
require 'sinatra/redirect_with_flash'

set :root, File.dirname("./")
set :public_folder, './views'

enable :sessions

class User < ActiveRecord::Base
end

class Voxelmodel < ActiveRecord::Base
end

class LikeList < ActiveRecord::Base
end

get "/" do
  if session["seenIntro"] != true
    session["seenIntro"] = true
    redirect "/about" 
  else
    @models = Voxelmodel.order("created_at DESC")
    @title = "Welcome."
    erb :"index"
  end
end

get "/about" do
  erb :"about"
end

get "/login" do
  erb :"login"
end

get "/logout" do
  session["user"] = nil
  redirect "/"
end

post "/login" do
  data = params[:post]
  puts ""
  puts data
  puts ""
  @user = User.find_by name: data["name"]
  if @user.password == data[:password]
    session["logedIn"] = true
    session["user"] = @user
    redirect "/", :notice => 'Logged in! :) (This message will disapear in 4 seconds.)'
  else
    redirect "/", :error => 'Something went wrong :( (This message will disapear in 4 seconds.)'
  end
end

get "/user/create" do
 @title = "Create post"
 @post = User.new
 erb :"user/create"
end

post "/user" do
 data = params[:post]
 file = data['picture']
 data['picture'] = 'uploads/' + file[:filename]
 @user = User.new(params[:post])
 if @user.save
  File.open('views/uploads/' + file[:filename], "wb") do |f|
    f.write(file[:tempfile].read)
  end 
  redirect "/"
 else
   erb :"posts/create"
 end
end

get "/VoxelEditor" do
  checkLogin()
  @load = ""
  erb :"VoxelEditor"
end

get "/VoxelEditor/:id" do |id|
  checkLogin()
  @load = Voxelmodel.find(params[:id]).content
  erb :"VoxelEditor"
end

get "/VoxelViewer/:id" do |id|
  @load = Voxelmodel.find(params[:id]).content
  erb :"VoxelViewer"
end

post "/saveModel" do
  json = getJSON(request)
  puts "================"
  puts "\nJSON ID: #{json["id"]}\n"
  puts "================"
  if json["id"] != "" && json["id"] != nil
    @model = Voxelmodel.find(json["id"])
    @model.name = json["name"]
    @model.content = json["content"]
    @model.picture = json["picture"]
    if @model.save
      redirect "/VoxelEditor/#{@model.id}"
    end
  else
    @model = Voxelmodel.new({:name => json["name"], :creator => session["user"].name, :content => json["content"], :picture => json["picture"], :likes => 0})
    if @model.save
      redirect "/VoxelEditor/#{@model.id}"
    end
  end
end

post "/like" do
  json = getJSON(request)  
  @model = Voxelmodel.find(json["id"])
  if hasLiked(session["user"], @model) == false  
    @model.likes += 1
    @model.save
    @ll = LikeList.new({"user" => session["user"].id, "model" => @model.id})
    @ll.save
  end
end

get "/mymodels" do
  checkLogin()
  @models = Voxelmodel.where("creator = '#{session["user"].name}'")
  erb :"MyModels"
end

get "/models" do
  @newModels = Voxelmodel.order("created_at DESC")
  @bestModels = Voxelmodel.order("likes DESC")
  erb :"Models"
end

def checkLogin
  if session["user"] == nil
    redirect "/login", :error => 'Bitte logge dich ein um diese Funktion nutzen zu können'
  end
end

def getJSON request
  json = {}
  j = []
  request.body.each do |b|
    j << JSON.parse(b)
  end
  json = j[0]
  return json
end

def hasLiked user, model
  if LikeList.where("user = '#{user.id}' AND model = '#{model.id}'").length == 0
    return false
  else
    return true
  end
end

