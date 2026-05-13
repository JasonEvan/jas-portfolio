<script setup lang="ts">
import { toast } from "vue-sonner";

definePageMeta({
  layout: "admin",
});

const { getProfile, updateProfile } = useProfile();

const profile = ref({
  name: "",
  title: "",
  bio: "",
  email: "",
  githubUrl: "",
  linkedinUrl: "",
  twitterUrl: "",
  avatarBase64: "",
});

const saving = ref(false);

// Fetch profile data on mount
onMounted(async () => {
  try {
    const data = await getProfile();
    if (data) {
      profile.value = {
        ...profile.value,
        ...data,
      };
    }
  } catch (err) {
    console.error("Failed to fetch profile:", err);
    toast.error("Gagal mengambil data profil");
  }
});

const handleSave = async () => {
  saving.value = true;
  try {
    await updateProfile(profile.value);
    toast.success("Profil berhasil diperbarui");
  } catch (err) {
    console.error("Save error:", err);
    toast.error("Gagal menyimpan perubahan");
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="profile-admin">
    <div class="admin-grid">
      <div class="form-section glass">
        <h3>Informasi Dasar</h3>
        <form @submit.prevent="handleSave" class="form">
          <div class="form-row">
            <BaseInput
              v-model="profile.name"
              label="Nama Lengkap"
              placeholder="Jason Evan"
            />
            <BaseInput
              v-model="profile.title"
              label="Title"
              placeholder="Full Stack Developer"
            />
          </div>

          <BaseInput
            v-model="profile.email"
            label="Email"
            type="email"
            placeholder="jason@example.com"
          />

          <div class="input-group">
            <label class="label">Bio Singkat</label>
            <textarea
              v-model="profile.bio"
              class="textarea"
              placeholder="Tulis bio singkat Anda..."
            ></textarea>
          </div>

          <div class="social-grid">
            <BaseInput v-model="profile.githubUrl" label="Github URL" />
            <BaseInput v-model="profile.linkedinUrl" label="LinkedIn URL" />
            <BaseInput v-model="profile.twitterUrl" label="Twitter URL" />
          </div>

          <div class="image-grid">
            <ImageUpload v-model="profile.avatarBase64" label="Avatar Profil" />
          </div>

          <div class="actions">
            <BaseButton type="submit" :loading="saving"
              >Simpan Perubahan</BaseButton
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-admin {
  max-width: 1200px;
}

.admin-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  align-items: start;
}

.form-section {
  padding: 32px;
  border-radius: 24px;
}

h3 {
  font-size: 1.25rem;
  margin-bottom: 24px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.social-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.image-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.textarea {
  width: 100%;
  min-height: 120px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-strong);
  border-radius: 12px;
  padding: 12px 16px;
  color: var(--color-text);
  font-family: var(--font-body);
  resize: vertical;
}

.textarea:focus {
  outline: none;
  border-color: var(--color-accent);
}

.lanyard-preview {
  padding: 32px;
  border-radius: 24px;
  display: flex;
  justify-content: center;
}

@media (max-width: 1024px) {
  .admin-grid {
    grid-template-columns: 1fr;
  }
}
</style>
