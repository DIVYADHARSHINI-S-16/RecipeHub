import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiMail, FiCalendar, FiBook, FiPlus, FiLock, FiHeart } from "react-icons/fi";
import toast from "react-hot-toast";
import Loader from "../components/common/Loader";
import ConfirmDialog from "../components/common/ConfirmDialog";
import MyRecipeCard from "../components/recipe/MyRecipeCard";
import RecipeCard from "../components/recipe/RecipeCard";
import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  getMyRecipes,
  deleteRecipeById,
  getFavoritesRequest,
} from "../api/userService";
import useAuth from "../hooks/useAuth";

const Profile = () => {
  const { logout } = useAuth();

  const [profile, setProfile] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("myRecipes");

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", bio: "" });
  const [savingProfile, setSavingProfile] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [changingPassword, setChangingPassword] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileData, recipesData] = await Promise.all([getMyProfile(), getMyRecipes()]);
      setProfile(profileData);
      setEditForm({ name: profileData.name, bio: profileData.bio || "" });
      setRecipes(recipesData);
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    setFavoritesLoading(true);
    try {
      const data = await getFavoritesRequest();
      setFavorites(data);
    } catch (error) {
      toast.error("Failed to load saved recipes");
    } finally {
      setFavoritesLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === "savedRecipes" && favorites.length === 0) {
      loadFavorites();
    }
  }, [activeTab]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (editForm.name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    setSavingProfile(true);
    try {
      const updated = await updateMyProfile(editForm);
      setProfile((prev) => ({ ...prev, ...updated }));

      const storedUser = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem("user", JSON.stringify({ ...storedUser, ...updated }));

      setIsEditing(false);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setChangingPassword(true);
    try {
      await changeMyPassword(passwordForm);
      toast.success("Password changed successfully");
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setShowPasswordForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteRecipeById(deleteTarget);
      setRecipes((prev) => prev.filter((r) => r._id !== deleteTarget));
      toast.success("Recipe deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete recipe");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (loading) return <Loader />;
  if (!profile) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 sm:p-8 mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center text-3xl font-bold text-primary-600 shrink-0 overflow-hidden">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              profile.name?.charAt(0).toUpperCase()
            )}
          </div>

          <div className="flex-1">
            {!isEditing ? (
              <>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{profile.name}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mt-2">
                  <span className="flex items-center gap-1">
                    <FiMail /> {profile.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiCalendar /> Joined {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiBook /> {profile.recipeCount} {profile.recipeCount === 1 ? "recipe" : "recipes"}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiHeart /> {profile.favoriteCount ?? 0} saved
                  </span>
                </div>
                {profile.bio && <p className="text-gray-600 dark:text-gray-300 mt-3">{profile.bio}</p>}
              </>
            ) : (
              <form onSubmit={handleProfileSave} className="space-y-3">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="input-field"
                  placeholder="Your name"
                />
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="input-field resize-none"
                  rows={3}
                  maxLength={200}
                  placeholder="Tell us about yourself..."
                />
                <p className="text-xs text-gray-400 text-right">{editForm.bio.length}/200</p>
                <div className="flex gap-3">
                  <button type="submit" disabled={savingProfile} className="btn-primary sm:w-auto px-6">
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({ name: profile.name, bio: profile.bio || "" });
                    }}
                    className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {!isEditing && (
            <div className="flex sm:flex-col gap-2 shrink-0">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary-500 hover:text-primary-600 transition text-sm font-medium"
              >
                <FiEdit2 size={14} /> Edit Profile
              </button>
              <button
                onClick={() => setShowPasswordForm((prev) => !prev)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary-500 hover:text-primary-600 transition text-sm font-medium"
              >
                <FiLock size={14} /> Password
              </button>
            </div>
          )}
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 space-y-3 max-w-md">
            <input
              type="password"
              placeholder="Current password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              className="input-field"
              required
            />
            <input
              type="password"
              placeholder="New password (min 6 characters)"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="input-field"
              required
              minLength={6}
            />
            <button type="submit" disabled={changingPassword} className="btn-primary sm:w-auto px-6">
              {changingPassword ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>

      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab("myRecipes")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
            activeTab === "myRecipes"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          My Recipes
        </button>
        <button
          onClick={() => setActiveTab("savedRecipes")}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
            activeTab === "savedRecipes"
              ? "border-primary-600 text-primary-600"
              : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          }`}
        >
          Saved Recipes
        </button>
      </div>

      {activeTab === "myRecipes" && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">My Recipes</h2>
            <Link
              to="/recipes/create"
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              <FiPlus /> New Recipe
            </Link>
          </div>

          {recipes.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
              <p className="text-4xl mb-3">📝</p>
              <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">You haven't created any recipes yet.</p>
              <Link to="/recipes/create" className="text-primary-600 font-semibold hover:underline">
                Create your first recipe
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <MyRecipeCard key={recipe._id} recipe={recipe} onDelete={setDeleteTarget} />
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "savedRecipes" && (
        <>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Saved Recipes</h2>

          {favoritesLoading ? (
            <Loader />
          ) : favorites.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
              <p className="text-4xl mb-3">💛</p>
              <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">You haven't saved any recipes yet.</p>
              <Link to="/" className="text-primary-600 font-semibold hover:underline">
                Browse recipes
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Recipe"
        message="This action cannot be undone. Are you sure you want to delete this recipe?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
};

export default Profile;