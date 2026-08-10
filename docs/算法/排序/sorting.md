---
marp: true
theme: default
size: 16:9
paginate: true
header: "Sorting Algorithms — OI Wiki"
footer: "算法竞赛课件 · 基础"
---

<!-- _class: lead -->

# 排序算法
## Quick Sort · Merge Sort · Radix Sort

**快速排序 · 归并排序 · 基数排序**

---

## 三种排序全景图

| 特性 | 快速排序 | 归并排序 | 基数排序 |
|------|:------:|:------:|:------:|
| **类型** | 比较排序 | 比较排序 | 非比较排序 |
| **思想** | 分治 + 划分 | 分治 + 合并 | 按关键字逐位排序 |
| **时间（平均）** | $O(n \log n)$ | $O(n \log n)$ | $O(d(n+r))$ |
| **时间（最坏）** | $O(n^2)$ | $O(n \log n)$ | $O(d(n+r))$ |
| **空间** | $O(\log n)$ | $O(n)$ | $O(n+r)$ |
| **稳定性** | ❌ 不稳定 | ✅ **稳定** | ✅ 稳定 |
| **额外空间** | 递归栈 | 等长辅助数组 | 计数数组+临时数组 |

---

## 分治思想对比

```
快速排序（先序）：              归并排序（后序）：
  Partition 划分                  递 归左半
  ↓                               ↓
  递归左 + 递归右                  递归右半
  ↓                               ↓
  无需合并！                       Merge 合并
  （划分后自然有序）                （两个有序段合并）
```

> 快速排序的**工作量在划分**（partition）；归并排序的**工作量在合并**（merge）。
> 快速排序像前序遍历；归并排序像后序遍历。

---

<!-- _class: lead -->

## 一、快速排序（Quick Sort）

---

## 快速排序：分治 + 划分

**三步走**：

1. **选择基准（pivot）**：从数组选一个元素作为分界
2. **划分（partition）**：重新排列，使 `< pivot` 在左，`> pivot` 在右
3. **递归**：对左右两个子数组重复操作

```
基准 = 4
[3, 1, 6, 4, 8, 2, 5]
        ↓ partition
[3, 1, 2]  4  [6, 8, 5]
  ↓ 递归      ↓ 递归
 排序完毕    排序完毕
```

> 划分完毕时，基准就已经在最终的正确位置上！

---

## 经典模板（挖坑法）

```cpp
// 划分函数：返回 pivot 最终位置
int partition(int a[], int l, int r) {
    int pivot = a[l];  // 取第一个为基准
    while (l < r) {
        while (l < r && a[r] >= pivot) r--;  // 右指针找比基准小的
        a[l] = a[r];
        while (l < r && a[l] <= pivot) l++;  // 左指针找比基准大的
        a[r] = a[l];
    }
    a[l] = pivot;
    return l;  // 基准归位
}

void quickSort(int a[], int l, int r) {
    if (l >= r) return;
    int pos = partition(a, l, r);
    quickSort(a, l, pos - 1);
    quickSort(a, pos + 1, r);
}
```

---

## 双指针模板（更常见）

```cpp
void quickSort(int q[], int l, int r) {
    if (l >= r) return;
    int x = q[(l + r) >> 1], i = l - 1, j = r + 1;
    while (i < j) {
        do i++; while (q[i] < x);  // i 找 ≥ x 的
        do j--; while (q[j] > x);  // j 找 ≤ x 的
        if (i < j) swap(q[i], q[j]);
    }
    quickSort(q, l, j);       // 左半
    quickSort(q, j + 1, r);   // 右半
}
```

**关键细节**：
- `x = q[(l+r)>>1]` 选中间为基准 → 递归用 `j` 作为分界
- `x = q[l]` → 递归用 `j`，不能用 `i-1/i`（有边界死循环风险）
- `x = q[r]` → 递归用 `i-1` 和 `i`

---

## 时间复杂度分析

| 情况 | 复杂度 | 条件 |
|------|:--:|------|
| **最优** | $O(n \log n)$ | 每次基准恰好是中位数 |
| **平均** | $O(n \log n)$ | 基准随机，期望分析 |
| **最坏** | $O(n^2)$ | 每次基准是最大/最小值 |

**为什么会退化？** 每次选到极值 → 划分极不平衡：
$$T(n) = T(n-1) + O(n) \quad \Rightarrow \quad O(n^2)$$

> 已排序的数组用第一个元素做 pivot → 直接退化为 $O(n^2)$！

**平均复杂度证明思路**：基准等概率随机选 → 任意两个元素比较概率 = $\frac{2}{j-i+1}$
→ 总比较次数期望 = $O(n \log n)$

---

## 优化 1：三路快速排序

**问题**：数组中有大量重复元素时，朴素划分仍会退化。

**思路**：划分为三部分：`< pivot | = pivot | > pivot`（荷兰国旗问题）

```cpp
void quickSort(int a[], int len) {
    if (len <= 1) return;
    int pivot = a[rand() % len];  // 随机基准
    int i = 0, j = 0, k = len;     // i扫指针, j左边界, k右边界
    while (i < k) {
        if (a[i] < pivot)
            swap(a[i++], a[j++]);          // 放到左区
        else if (a[i] > pivot)
            swap(a[i], a[--k]);             // 放到右区
        else
            i++;                            // 留在中区
    }
    quickSort(a, j);          // < 部分
    quickSort(a + k, len - k); // > 部分
    // = 部分已经就位，不需排序！
}
```

> 当元素全部相等时 → $O(n)$ 一趟扫描完成！

---

## 优化 2：其他常见优化

### 三数取中法
选取 `a[l]`、`a[mid]`、`a[r]` 的**中位数**作为 pivot，避免有序数据退化。

### 小数组切换插入排序
```cpp
if (r - l <= 15) { insertionSort(a, l, r); return; }
```
小规模上插入排序常数极小。

- 快速排序 + 堆排序混合
- 递归深度限制为 $\lfloor \log_2 n \rfloor$，超过后切换堆排序
- 保证最坏 $O(n \log n)$
- **C++ `std::sort` 正是这样实现的！**

---

## 快速选择：$O(n)$ 找第 k 小

利用划分后 pivot 的位置信息，**只向一边递归**（减治）：

```cpp
int quickSelect(int a[], int l, int r, int k) {
    if (l == r) return a[l];
    int pos = partition(a, l, r);      // 三路划分
    int leftLen = pos - l;              // 左半部分长度
    if (k <= leftLen)
        return quickSelect(a, l, pos - 1, k);
    else if (k == leftLen + 1)
        return a[pos];                  // 就是这个！
    else
        return quickSelect(a, pos + 1, r, k - leftLen - 1);
}
```

复杂度：$T(n) = T(n/2) + O(n) \Rightarrow O(n)$ （期望）

> 三路快排版本的快速选择可以**期望 $O(n)$ 严格正确**。

---

<!-- _class: lead -->

## 二、归并排序（Merge Sort）

---

## 归并排序：分治 + 合并

**三步走**：

1. **划分**：取中点，将数组均匀分成两半
2. **递归**：对左右两半分别归并排序
3. **合并**：将两个已有序的子数组合并为一个

```
[38, 27, 43, 3, 9, 82, 10]
         ↓ 递归拆分
[38, 27, 43]        [3, 9, 82, 10]
    ↓                    ↓
[38] [27, 43]        [3, 9] [82, 10]
    ↓    ↓              ↓       ↓
  拆分到单个元素（天然有序）
         ↓ 合并（merge）
  [27, 38, 43]   [3, 9, 10, 82]
         ↓ 合并
  [3, 9, 10, 27, 38, 43, 82]
```

> 归并排序的"重头戏"在合并——两个有序数组二路归并。

---

## 递归模板

```cpp
int tmp[N];  // 全局临时数组，避免反复分配

void mergeSort(int a[], int l, int r) {
    if (l >= r) return;
    int mid = (l + r) >> 1;
    mergeSort(a, l, mid);        // 递归左半
    mergeSort(a, mid + 1, r);    // 递归右半

    // 合并两个有序区间 [l,mid] 和 [mid+1,r]
    int i = l, j = mid + 1, k = 0;
    while (i <= mid && j <= r) {
        if (a[i] <= a[j]) tmp[k++] = a[i++];
        else             tmp[k++] = a[j++];
    }
    while (i <= mid) tmp[k++] = a[i++];   // 剩余左半
    while (j <= r)   tmp[k++] = a[j++];   // 剩余右半

    for (i = l, k = 0; i <= r; i++, k++)  // 拷贝回原数组
        a[i] = tmp[k];
}
```

> `if (a[i] <= a[j])` 中的 `=` 保证了**稳定性**（相等时左半优先）

---

## 迭代（倍增）实现

不用递归，从段长 1 开始逐步翻倍合并：

```cpp
void mergeSort(int a[], int n) {
    int tmp[n];
    for (int seg = 1; seg < n; seg <<= 1) {        // 段长翻倍
        for (int l = 0; l < n; l += seg * 2) {
            int mid = l + seg;
            int r = min(mid + seg, n);              // 防越界
            int i = l, j = mid, k = l;
            while (i < mid && j < r)
                tmp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];
            while (i < mid) tmp[k++] = a[i++];
            while (j < r)   tmp[k++] = a[j++];
            for (i = l; i < r; i++) a[i] = tmp[i];  // 拷贝回去
        }
    }
}
```

> 迭代版避免了递归栈开销，适合超大 $n$

---

## 核心应用：求逆序对

> **逆序对**：若 $i < j$ 且 $a[i] > a[j]$，称 $(a[i], a[j])$ 为一个逆序对。

**原理**：合并两个有序段时，当取**右段**元素 → 左段剩余元素都大于它！

---

```cpp
long long mergeSort(int a[], int l, int r) {
    if (l >= r) return 0;
    int mid = (l + r) >> 1;
    long long ans = mergeSort(a, l, mid) + mergeSort(a, mid + 1, r);

    int i = l, j = mid + 1, k = 0;
    while (i <= mid && j <= r) {
        if (a[i] <= a[j])
            tmp[k++] = a[i++];
        else {
            ans += mid - i + 1;  // ★ 核心：左段 i..mid 都 > a[j]
            tmp[k++] = a[j++];
        }
    }
    while (i <= mid) tmp[k++] = a[i++];
    while (j <= r)   tmp[k++] = a[j++];
    for (i = l, k = 0; i <= r; ) a[i++] = tmp[k++];
    return ans;
}
```

> 复杂度 $O(n \log n)$，$n \le 5 \times 10^5$ 可过。注意答案可能到 $n^2/2$，需用 `long long`！

---

## 归并排序性质总结

| 属性 | 值 |
|------|:--:|
| 平均/最好/最坏 | 均为 $\Theta(n \log n)$ |
| 空间复杂度 | $O(n)$（辅助数组） |
| 稳定性 | ✅ **稳定** |
| 适用场景 | 稳定排序需求；求逆序对 |

**为什么稳定？**
合并时两元素相等，优先取左半段 → 原左半段的元素排在前面。

**为什么不用归并排序代替快排？**
- 需要 $O(n)$ 额外空间（快排只需 $O(\log n)$ 栈空间）
- 合并步骤的内存访问模式不如划分来得"局部化" → 常数较大

---

<!-- _class: lead -->

## 三、基数排序（Radix Sort）

---

## 基数排序：非比较排序

**核心思想**：将元素拆分为多个关键字，从低位到高位（或反之）逐位稳定排序。

> 基数排序**不是通过比较元素大小**来排序，而是按**数字的每一位**分桶。

```
排序 [329, 457, 657, 839, 436, 720, 355]

第1轮（个位）：  720 | 355 | 436 | 457,657 | 329,839
第2轮（十位）：  720 | 329 | 436,839 | 355,457,657
第3轮（百位）：  329 | 355 | 436 | 457 | 657 | 720 | 839

✅ 排序完成！
```

> 每轮内部用**计数排序**（稳定），按当前数位分 0-9 共 10 个桶。

---

## 前置：计数排序

基数排序的内层使用**计数排序**——值域小时可以做到 $O(n+k)$：

```cpp
// 对数组 a 按关键字 key 稳定排序，key 值域 [0, R-1]
void countingSort(int a[], int n, int R, function<int(int)> key) {
    vector<int> cnt(R, 0), tmp(n);
    for (int i = 0; i < n; i++) cnt[key(a[i])]++;      // 统计
    for (int i = 1; i < R; i++) cnt[i] += cnt[i - 1];  // 前缀和
    for (int i = n - 1; i >= 0; i--)                    // 逆序！保证稳定
        tmp[--cnt[key(a[i])]] = a[i];
    for (int i = 0; i < n; i++) a[i] = tmp[i];
}
```

> 逆序遍历是为了**稳定性**——同 key 的元素保持原先后顺序

---

## LSD 基数排序（低位优先）

**LSD（Least Significant Digit）**：从最低位到最高位，迭代执行稳定排序。

```cpp
void radixSortLSD(int a[], int n) {
    int maxVal = *max_element(a, a + n);
    vector<int> tmp(n);
    int cnt[10];

    for (int exp = 1; maxVal / exp > 0; exp *= 10) {
        fill(cnt, cnt + 10, 0); // 计数
        for (int i = 0; i < n; i++) cnt[(a[i] / exp) % 10]++; // 前缀和
        for (int i = 1; i < 10; i++) cnt[i] += cnt[i - 1];
        // 逆序放入（稳定）
        for (int i = n - 1; i >= 0; i--) {
            int d = (a[i] / exp) % 10;
            tmp[--cnt[d]] = a[i];
        }
        // 回写
        for (int i = 0; i < n; i++) a[i] = tmp[i];
    }
}
```

> $d$ 为最大数的位数，$r$ 为基数（10）→ $O(d(n+r))$。对于 32 位整数：$d=10$，$r=10$

---

## LS优化：按字节分组

对于 32 位整数，可将基数从 10 改为 256（一个字节）：

```cpp
void radixSort32(int a[], int n) {
    int tmp[n];
    for (int shift = 0; shift < 32; shift += 8) {  // 4 轮
        int cnt[256] = {};
        for (int i = 0; i < n; i++)
            cnt[(a[i] >> shift) & 0xFF]++;
        // exclusive scan：计算每个桶的起始位置
        int sum = 0;
        for (int i = 0; i < 256; i++) {
            int old = cnt[i]; cnt[i] = sum; sum += old;
        }
        for (int i = 0; i < n; i++) {
            int bucket = (a[i] >> shift) & 0xFF;
            tmp[cnt[bucket]++] = a[i];
        }
        swap(a, tmp); // 或 copy
    }
}
```

> 使用 `exclusive_scan` 可以**正序**遍历并保持稳定，常数更优

---

## MSD 基数排序（高位优先）

**MSD（Most Significant Digit）**：从最高位向最低位递归排序。

```cpp
void radixSortMSD(int a[], int l, int r, int exp) {
    if (r - l <= 1 || exp == 0) return;
    // 按当前位分到 10 个桶
    vector<int> buckets[10];
    for (int i = l; i < r; i++)
        buckets[(a[i] / exp) % 10].push_back(a[i]);
    // 收集回原数组
    int pos = l;
    for (int d = 0; d < 10; d++) {
        for (int x : buckets[d]) a[pos++] = x;
    }
    // 递归排序每个非空桶
    pos = l;
    for (int d = 0; d < 10; d++) {
        int sz = buckets[d].size();
        if (sz > 1) radixSortMSD(a, pos, pos + sz, exp / 10);
        pos += sz;
    }
}
```

> MSD 递归实现，适合**字符串排序**——高位先区分，低位在子组内处理

---

## LSD vs MSD 对比

| 特性 | LSD | MSD |
|------|:---:|:---:|
| 处理顺序 | 低位 → 高位 | 高位 → 低位 |
| 实现方式 | **迭代** | **递归** |
| 代码量 | 较短 | 较长 |
| 字符串排序 | 需对齐长度 | ✅ 天然适合 |
| 时间复杂度 | $O(d(n+r))$ | $O(d(n+r))$ |
| 稳定性 | ✅ 稳定 | ✅ 稳定 |

**实战建议**：
- **整数排序** → LSD（简单高效，迭代）
- **字符串排序** → MSD（不必等长，提前终止递归）

---

<!-- _class: lead -->

## 四、总结与对比

---

## 三种排序全面对比

| | 快速排序 | 归并排序 | 基数排序 |
|------|:---:|:---:|:---:|
| **类型** | 比较 | 比较 | 非比较 |
| **分治方式** | 划分（partition） | 合并（merge） | 按位分桶 |
| **时间** | $O(n \log n)$ | $\Theta(n \log n)$ | $O(d(n+r))$ |
| **最坏** | $O(n^2)$ | $\Theta(n \log n)$ | $O(d(n+r))$ |
| **空间** | $O(\log n)$ | $O(n)$ | $O(n+r)$ |
| **稳定性** | ❌ 不稳定 | ✅ 稳定 | ✅ 稳定 |
| **sort() 实现** | Introsort | — | — |

---

## 选型指南

| 场景 | 推荐算法 | 原因 |
|------|:---:|------|
| **一般情况** | 快速排序 | 局部性好，实际最快 |
| **需要稳定排序** | 归并排序 | 相等元素保序 |
| **求逆序对** | 归并排序 | 合并时自然统计 |
| **整数 + 位数少** | 基数排序 | $O(dn)$ 可突破 $O(n \log n)$ |
| **字符串排序** | MSD 基数排序 | 按前缀分组，天然契合 |
| **排序模板题** | `std::sort` | 内置内省排序，最优解 |

> 竞赛中 99% 的情况直接用 `std::sort`。学习这些算法的意义在于：
> **掌握其思想**——分治、划分、合并、按位处理——用于解决更复杂的问题。

---

## 例题汇总

| 题号 | 名称 | 相关算法 |
|:----:|------|:--:|
| P1177 | 【模板】排序 | 快排/归并/基数均可 |
| P1908 | 逆序对 | 归并排序（或树状数组） |
| P1923 | 【模板】快速排序 | 快排优化 |
| LeetCode 215 | 数组中第 K 个最大元素 | 快速选择 |
| LeetCode 912 | 排序数组 | 三路快排 / 内省排序 |

---

## 核心要点回顾

1. **快速排序**：划分是核心，work in **前序**；三路划分 + 随机 pivot 是最佳实践
2. **归并排序**：合并是核心，work in **后序**；合并时 `ans += mid - i + 1` 即逆序对
3. **基数排序**：**不比较**，逐位用计数排序分桶；LSD 迭代简单，MSD 适合字符串
4. **稳定性**：快排不稳，归并和基数都可以是稳定排序
5. **内存局部性**：快排最好 → 实际跑得最快；归并需要额外数组 → 常数较大
6. **`std::sort`** = 内省排序，竞赛中直接使用即可

---

<!-- _class: lead -->

# Thanks！

