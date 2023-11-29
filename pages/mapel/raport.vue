<script setup>
import { useAuthStore } from "~/stores/auth";
import { createClient } from "@supabase/supabase-js";
import Swal from 'sweetalert2';

const { baseUrl, apikey } = useAppConfig();
const supabase = createClient(baseUrl, apikey);


const mapel = ref([]);
const loading = ref(true);
const totalNilai = ref(0);
const getMapel = async () => {
    const { data, error } = await supabase.from("mapels").select("*");
    if (error) {
        console.log(error);
    } else {
        mapel.value = data;
        loading.value = false;
        calculateTotal();
    }
};
const calculateTotal = () => {
    totalNilai.value = mapel.value.reduce(
        (total, m) => total + parseFloat(m.nilai || 0),
        0
    );
};
const rataNilai = computed(() => {
    const count = mapel.value.length;
    return count > 0 ? (totalNilai.value / count).toFixed(2) : 0;
});
const checkAllStatus = async () => {
    for (let index = 0; index < mapel.value.length; index++) {
        const nilai = parseFloat(mapel.value[index].nilai || 0);
        const kkm = parseFloat(mapel.value[index].kkm || 0);
        const status = nilai >= kkm ? "Lulus" : "Tidak Lulus";
        mapel.value[index].status = status;
        await supabase
            .from("mapels")
            .update({ status })
            .eq("id", mapel.value[index].id);
    }
};
onMounted(() => {
    getMapel();
});

const authStore = useAuthStore();
const isAuthenticated = ref();
const router = useRouter();
isAuthenticated.value = useCookie("access_token").value;

const logout = async () => {
    await authStore.logout();
    const accessToken = useCookie("access_token");
    const refreshToken = useCookie("refresh_token");
    accessToken.value = null;
    refreshToken.value = null;
    setTimeout(() => {
        isAuthenticated.value = useCookie("access_token").value;
    }, 100);
    router.push({
        path: "/",
    });
};
definePageMeta({
    middleware: ["user-access"],
});

const showDropdownIndex = ref(null);

const confirmDelete = async (id) => {
    const result = await Swal.fire({
        title: 'Apa Kamu Yakin?',
        text: 'Kamu Tidak Dapat Mengembalikan Ini!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Hapus Ini!',
    });

    if (result.isConfirmed) {
        try {
            await supabase.from("mapels").delete().eq('id', id);
            getMapel();
            Swal.fire('Deleted!', 'Item Anda telah dihapus.', 'success');
        } catch (e) {
            console.log(e.message);
            Swal.fire('Error!', 'An error occurred while deleting the item.', 'error');
        }
    }
};
const confirmLogout = () => {
    Swal.fire({
        title: 'Are you sure?',
        text: 'You will be logged out!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, logout!'
    }).then((result) => {
        if (result.isConfirmed) {
            logout();
        }
    });
};
</script>
<template>
    <Head>
        <Title>Halaman Raport</Title>
    </Head>
    <div v-if="loading">
        <div class="loader"></div>
    </div>
    <div v-else>
        <aside
            class="max-w-[250px] ease-nav-brand z-990 fixed inset-y-0 my-4 ml-4 block w-full -translate-x-full flex-wrap items-center justify-between overflow-y-auto rounded-2xl border-0 bg-white p-0 antialiased shadow-none transition-transform duration-200 xl:left-0 xl:translate-x-0 xl:bg-transparent">
            <div class="h-19.5 text-center">
                <i class="absolute top-0 right-0 hidden p-4 opacity-50 cursor-pointer fas fa-times text-slate-400 xl:hidden"
                    sidenav-close></i>
                <NuxtLink to="/mapel" exact class="block px-8 py-6 m-0 text-sm whitespace-nowrap text-slate-700">
                    <img src="/favicon.ico"
                        class="inline h-full max-w-full transition-all duration-200 ease-nav-brand max-h-8"
                        alt="main_logo" />
                    <span class="ml-1 font-semibold transition-all duration-200 ease-nav-brand">Rata Rata
                    </span>
                </NuxtLink>
            </div>
            <hr class="h-px mt-0 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent" />
            <div class="items-center block w-auto max-h-screen overflow-auto h-sidenav grow basis-full">
                <ul class="flex flex-col pl-0 mb-0">
                    <li class="mt-[2px] w-full">
                        <NuxtLink to="/mapel"
                            class="pt-[10.8px] pb-[10.8px] text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap rounded-lg bg-white px-4 font-semibold text-slate-700 transition-colors">
                            <div
                                class="shadow-soft-2xl mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 text-center xl:p-2.5">
                                <svg width="12px" height="12px" viewBox="0 0 45 40" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <title>shop</title>
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <g transform="translate(-1716.000000, -439.000000)" fill="#FFFFFF"
                                            fill-rule="nonzero">
                                            <g transform="translate(1716.000000, 291.000000)">
                                                <g transform="translate(0.000000, 148.000000)">
                                                    <path class="fill-slate-800 opacity-60"
                                                        d="M46.7199583,10.7414583 L40.8449583,0.949791667 C40.4909749,0.360605034 39.8540131,0 39.1666667,0 L7.83333333,0 C7.1459869,0 6.50902508,0.360605034 6.15504167,0.949791667 L0.280041667,10.7414583 C0.0969176761,11.0460037 -1.23209662e-05,11.3946378 -1.23209662e-05,11.75 C-0.00758042603,16.0663731 3.48367543,19.5725301 7.80004167,19.5833333 L7.81570833,19.5833333 C9.75003686,19.5882688 11.6168794,18.8726691 13.0522917,17.5760417 C16.0171492,20.2556967 20.5292675,20.2556967 23.494125,17.5760417 C26.4604562,20.2616016 30.9794188,20.2616016 33.94575,17.5760417 C36.2421905,19.6477597 39.5441143,20.1708521 42.3684437,18.9103691 C45.1927731,17.649886 47.0084685,14.8428276 47.0000295,11.75 C47.0000295,11.3946378 46.9030823,11.0460037 46.7199583,10.7414583 Z">
                                                    </path>
                                                    <path class="fill-slate-800"
                                                        d="M39.198,22.4912623 C37.3776246,22.4928106 35.5817531,22.0149171 33.951625,21.0951667 L33.92225,21.1107282 C31.1430221,22.6838032 27.9255001,22.9318916 24.9844167,21.7998837 C24.4750389,21.605469 23.9777983,21.3722567 23.4960833,21.1018359 L23.4745417,21.1129513 C20.6961809,22.6871153 17.4786145,22.9344611 14.5386667,21.7998837 C14.029926,21.6054643 13.533337,21.3722507 13.0522917,21.1018359 C11.4250962,22.0190609 9.63246555,22.4947009 7.81570833,22.4912623 C7.16510551,22.4842162 6.51607673,22.4173045 5.875,22.2911849 L5.875,44.7220845 C5.875,45.9498589 6.7517757,46.9451667 7.83333333,46.9451667 L19.5833333,46.9451667 L19.5833333,33.6066734 L27.4166667,33.6066734 L27.4166667,46.9451667 L39.1666667,46.9451667 C40.2482243,46.9451667 41.125,45.9498589 41.125,44.7220845 L41.125,22.2822926 C40.4887822,22.4116582 39.8442868,22.4815492 39.198,22.4912623 Z">
                                                    </path>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <span class="ml-1 duration-300 opacity-100 pointer-events-none ease-soft">Dashboard</span>
                        </NuxtLink>
                    </li>

                    <li class="my-[2px] w-full">
                        <NuxtLink to="/mapel/raport"
                            class="pt-[10.8px] pb-[10.8px] shadow-md text-sm ease-nav-brand my-0 mx-4 flex items-center whitespace-nowrap rounded-lg bg-white px-4 font-semibold text-slate-700 transition-colors">
                            <div
                                class="bg-gradient-to-tl from-purple-700 to-pink-500 shadow-md mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 text-center xl:p-2.5">
                                <svg width="12px" height="12px" viewBox="0 0 42 42" version="1.1"
                                    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <title>office</title>>
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <g transform="translate(-1869.000000, -293.000000)" fill="#FFFFFF"
                                            fill-rule="nonzero">
                                            <g transform="translate(1716.000000, 291.000000)">
                                                <g transform="translate(153.000000, 2.000000)">
                                                    <path class="opacity-60"
                                                        d="M12.25,17.5 L8.75,17.5 L8.75,1.75 C8.75,0.78225 9.53225,0 10.5,0 L31.5,0 C32.46775,0 33.25,0.78225 33.25,1.75 L33.25,12.25 L29.75,12.25 L29.75,3.5 L12.25,3.5 L12.25,17.5 Z">
                                                    </path>
                                                    <path class=""
                                                        d="M40.25,14 L24.5,14 C23.53225,14 22.75,14.78225 22.75,15.75 L22.75,38.5 L19.25,38.5 L19.25,22.75 C19.25,21.78225 18.46775,21 17.5,21 L1.75,21 C0.78225,21 0,21.78225 0,22.75 L0,40.25 C0,41.21775 0.78225,42 1.75,42 L40.25,42 C41.21775,42 42,41.21775 42,40.25 L42,15.75 C42,14.78225 41.21775,14 40.25,14 Z M12.25,36.75 L7,36.75 L7,33.25 L12.25,33.25 L12.25,36.75 Z M12.25,29.75 L7,29.75 L7,26.25 L12.25,26.25 L12.25,29.75 Z M35,36.75 L29.75,36.75 L29.75,33.25 L35,33.25 L35,36.75 Z M35,29.75 L29.75,29.75 L29.75,26.25 L35,26.25 L35,29.75 Z M35,22.75 L29.75,22.75 L29.75,19.25 L35,19.25 L35,22.75 Z">
                                                    </path>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <span class="ml-1 duration-300 opacity-100 pointer-events-none ease-soft">Raport</span>
                        </NuxtLink>
                    </li>
                </ul>
            </div>

            <hr class="h-px mt-5 bg-transparent bg-gradient-to-r from-transparent via-black/40 to-transparent" />
        </aside>

        <main class="xl:ml-[15.625rem] relative h-full max-h-screen rounded-xl transition-all duration-200">
            <!-- Navbar -->
            <nav class="relative flex flex-wrap items-center justify-between px-0 py-2 mx-6 transition-all shadow-none duration-250 ease-soft-in rounded-2xl lg:flex-nowrap lg:justify-start"
                navbar-main="" navbar-scroll="true">
                <div class="flex items-center justify-between w-full px-4 py-1 mx-auto flex-wrap-inherit">
                    <nav>
                        <!-- breadcrumb -->
                        <ol class="flex flex-wrap pt-1 mr-12 bg-transparent rounded-lg sm:mr-16">
                            <li class="text-sm leading-normal">
                                <a class="opacity-50 text-slate-700" href="javascript:;">Pages</a>
                            </li>
                            <li class="text-sm pl-2 capitalize leading-normal text-slate-700 before:float-left before:pr-2 before:text-gray-600 before:content-['/']"
                                aria-current="page">
                                Raport
                            </li>
                        </ol>
                        <h6 class="mb-0 font-bold capitalize">Raport</h6>
                    </nav>

                    <div class="flex items-center mt-2 grow sm:mt-0 sm:mr-6 md:mr-0 lg:flex lg:basis-auto">
                        <div class="flex items-center md:ml-auto md:pr-4">
                            <div class="relative flex flex-wrap items-stretch w-full transition-all rounded-lg ease-soft">
                                <span
                                    class="text-sm ease-soft leading-5.6 absolute z-50 -ml-px flex h-full items-center whitespace-nowrap rounded-lg rounded-tr-none rounded-br-none border border-r-0 border-transparent bg-transparent py-2 px-2.5 text-center font-normal text-slate-500 transition-all">
                                    <i class="fas fa-search"></i>
                                </span>
                            </div>
                        </div>
                        <div>
                            <div class="text-base cursor-pointer bg-red-600 px-6 py-2 text-white rounded-lg hover:bg-red-600/80"
                                @click="confirmLogout">Logout</div>
                        </div>
                    </div>
                </div>
            </nav>

            <div class="w-full px-6 py-6 mx-auto">
                <div class="mb-4 space-x-4">
                    <NuxtLink to="/mapel/create" class="btn-primary">
                        Tambah Data
                    </NuxtLink>

                    <button @click="checkAllStatus" type="button" class="btn-secondary">
                        Cek Status
                    </button>
                </div>

                <div class="flex flex-wrap -mx-3">
                    <div class="w-full overflow-hidden rounded-lg shadow-md">
                        <div class="bg-white p-4">
                            <table class="w-full border border-gray-300">
                                <thead>
                                    <tr>
                                        <th class="p-2 text-center border-b">Nomor</th>
                                        <th class="p-2 text-center border-b">Mapel</th>
                                        <th class="p-2 text-center border-b">KKM</th>
                                        <th class="p-2 text-center border-b">Nilai</th>
                                        <th class="p-2 text-center border-b">Status</th>
                                        <th class="p-2 text-center border-b">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(m, i) in mapel" :key="m.id">
                                        <td class="p-2 text-center border-b">{{ i + 1 }}</td>
                                        <td class="p-2 text-center border-b">{{ m.mapel }}</td>
                                        <td class="p-2 text-center border-b">{{ m.kkm }}</td>
                                        <td class="p-2 text-center border-b">{{ m.nilai }}</td>
                                        <td :class="{ 'text-red-500': m.status === 'Tidak Lulus', 'text-green-500': m.status === 'Lulus' }"
                                            class="p-2 text-center border-b">
                                            {{ m.status }}
                                        </td>
                                        <td class="p-2 text-center border-b">
                                            <div class="relative inline-block text-left">
                                                <div>
                                                    <button
                                                        @click="showDropdownIndex === i ? showDropdownIndex = null : showDropdownIndex = i"
                                                        type="button"
                                                        class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-200 active:bg-gray-50 active:text-gray-800"
                                                        id="options-menu" aria-haspopup="true" aria-expanded="true">
                                                        Action
                                                    </button>
                                                </div>

                                                <transition name="fade">
                                                    <div v-show="showDropdownIndex === i" class="dropdown">
                                                        <div class="py-1">
                                                            <NuxtLink :to="`/mapel/${m.id}`"
                                                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                                Edit
                                                            </NuxtLink>
                                                            <button @click="confirmDelete(m.id)"
                                                                class="block px-4 py-2 text-sm text-red-700 hover:bg-red-100">
                                                                Hapus <!-- Change hover text for delete button -->
                                                            </button>
                                                        </div>
                                                    </div>
                                                </transition>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th colspan="3" class="p-2 text-right border-t">Total:</th>
                                        <th id="totalNilai" class="p-2 text-center border-t">
                                            {{ totalNilai }}
                                        </th>
                                        <th class="p-2 text-center border-t"></th>
                                    </tr>
                                    <tr>
                                        <th colspan="3" class="p-2 text-right">Rata-rata:</th>
                                        <th id="rataNilai" class="p-2 text-center">
                                            {{ rataNilai }}
                                        </th>
                                        <th class="p-2 text-center"></th>
                                    </tr>
                                </tfoot>
                            </table>

                            <!-- Ikon cetak di tengah
                            <div class="text-center mt-4">
                                <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor" class="h-5 w-5 inline-block align-text-top">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 6h16M4 12h16m-7 6h7"></path>
                                    </svg>
                                    Export To excel
                                </button>
                            </div> -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- end cards -->
        </main>
    </div>
</template>
<style>
.loader {
    display: block;
    position: fixed;
    z-index: 1031;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
    box-sizing: border-box;
    border: solid 2px transparent;
    border-top-color: gray;
    border-left-color: gray;
    border-bottom-color: #efefef;
    border-right-color: #efefef;
    border-radius: 50%;
    -webkit-animation: loader 400ms linear infinite;
    animation: loader 400ms linear infinite;
}

@keyframes loader {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }

    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}

.btn-primary {
    @apply bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded;
}

.btn-secondary {
    @apply bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded;
}

.dropdown {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: calc(100% + 8px);
    /* Adjust the offset as needed */
    /* Your existing styles for the dropdown */
    /* ... */
}
</style>
