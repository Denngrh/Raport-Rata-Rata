<script lang="ts" setup>
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const isLoading = ref(false);
const isShowAlert = ref(false);
const isSuccess = ref(false);
const message = ref("");
const router = useRouter();

const login = ref([
    { name: "email", label: "Email", type: "email", value: "", placeholder: "name@company.com", required: true },
    { name: "password", label: "Password", type: "password", value: "", placeholder: "••••••••", required: true },
]);

const submitLogin = async () => {
    isLoading.value = true;
    const result: { [key: string]: string } = {};
    login.value.forEach((item) => {
        result[item.name] = item.value;
    });

    await authStore.login(result);

    if (!authStore.status) {
        isSuccess.value = authStore.status;
        message.value = authStore.message;
        isShowAlert.value = true;
        isLoading.value = false;
    } else {
        isSuccess.value = authStore.status;
        message.value = authStore.message;
        isShowAlert.value = true;
        isLoading.value = false;
        router.push({
            path: "/mapel"
        })
    }
}
</script>
<template>
    <section>
        <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <img class="mx-auto h-[150px] w-[120px]"
                    src="https://github.com/Denngrh/smkcoding-nuxtjs/assets/112230212/3128eaee-2d49-4fec-90c1-5060f875e067"
                    alt="Logo Raport">
                <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Selamat Datang
                </h2>
            </div>
            <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div v-if="isShowAlert"
                :class="`p-4 mb-4 text-sm rounded-lg ${isSuccess ? 'bg-green-100 text-green-800' : 'text-red-800 bg-red-100'}`"
                role="alert">
                {{ message }}
            </div>
                <form class="" @submit.prevent="submitLogin">
                    <div v-for="(item, index) in login" :key="index" class="mb-6">
                        <label :for="item.name" class="block mb-2 text-sm font-medium text-gray-900">{{ item.label
                        }}</label>
                        <input :type="item.type" :name="item.name" :id="item.name" v-model="item.value"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            :placeholder="item.placeholder" :required="item.required">
                    </div>
                    <button type="submit"
                        class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        <span v-if="!isLoading">Login</span>
                        <div v-else role="status">
                            <svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin fill-blue-600"
                                viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor" />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill" />
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </button>
                </form>
                <p class="mt-10 text-center text-sm text-gray-500">
                    Belum Punya akun?
                    <NuxtLink to="/register" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Register</NuxtLink>
                </p>
            </div>
        </div>
    </section>
</template>