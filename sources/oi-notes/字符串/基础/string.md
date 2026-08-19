---
marp: true
theme: default
size: 16:9
paginate: true
footer: "算法竞赛课件 · 字符串"
---

<!-- _class: lead -->

# 字符串算法
## KMP · Z 函数 · Manacher · AC 自动机

**前缀函数 · 扩展 KMP · 马拉车 · Aho–Corasick**

**难度：提高 → 省选**

---

## 四种算法全景图

| 算法 | 解决的问题 | 核心思想 | 复杂度 |
|------|------|------|:--:|
| **KMP** | 单模式串匹配 | 前缀函数 π，失配跳转 | $O(n+m)$ |
| **Z 函数** | LCP / 匹配 | Z-box 加速，对称继承 | $O(n)$ |
| **Manacher** | 最长回文子串 | 回文对称，维护最右边界 | $O(n)$ |
| **AC 自动机** | 多模式串匹配 | Trie + fail 指针 | $O(\sum \vert s_i\vert  + \vert S\vert )$ |

> 共同点：都是 $O(n)$ 或近似线性的字符串算法，核心思想都是**利用已计算的信息加速**。

---

## 加速字符串算法的核心套路

所有高效字符串算法的共同模式：

```
维护一个"已处理的最右边界"（Z-box、回文边界、fail链...）
    ↓
当前位置在边界内 → 利用对称性/继承性直接获取初值
当前位置在边界外 → 朴素扩展
    ↓
扩展后更新边界
```

| 算法 | "边界" | 加速技巧 |
|------|:--:|------|
| KMP | — | `j = π[j-1]` 跳转 |
| Z 函数 | Z-box `[l, r]` | `z[i] = z[i-l]` 继承 |
| Manacher | 回文区间 `[l, r]` | 对称位半径拷贝 |
| AC 自动机 | fail 指针 | Trie 图：一次跳转 |

---

<!-- _class: lead -->

## 一、KMP 算法

---

## 前缀函数 π：KMP 的核心

> **π[i]** = 子串 $s[0..i]$ 中，最长的**相等的真前缀与真后缀**的长度。

```
字符串 "aabaaab"
  π[0] = 0    "a"         → 无相等真前后缀
  π[1] = 1    "aa"        → "a" = "a"
  π[2] = 0    "aab"       → 无
  π[3] = 1    "aaba"      → "a" = "a"
  π[4] = 2    "aabaa"     → "aa" = "aa"
  π[5] = 2    "aabaaa"    → "aa" = "aa"
  π[6] = 3    "aabaaab"   → "aab" = "aab"

π = [0, 1, 0, 1, 2, 2, 3]
```

> 如果 `s[i] == s[π[i-1]]`，则 `π[i] = π[i-1] + 1`（相邻最多增 1）

---

## 前缀函数计算 — 关键优化

**当 `s[i] ≠ s[π[i-1]]` 时怎么办？**

找次长的 border：`j = π[π[i-1] - 1]`，反复跳转直到匹配或 `j=0`。

```cpp
vector prefix_function(string s) {
    int n = s.size();
    vector pi(n);
    for (int i = 1; i < n; i++) {
        int j = pi[i - 1];
        while (j > 0 && s[i] != s[j])  // 失配 → 跳转
            j = pi[j - 1];
        if (s[i] == s[j]) j++;
        pi[i] = j;
    }
    return pi;
}
```

> 复杂度 $O(n)$：`j` 每次最多 +1，总减少不超过总增加

---

## KMP 字符串匹配

**技巧**：构造拼接串 `pattern + '#' + text`，计算其前缀函数。

```cpp
vector find_occurrences(string text, string pattern) {
    string s = pattern + '#' + text;
    int n = pattern.size();
    vector pi = prefix_function(s), ans;
    for (int i = n + 1; i < s.size(); i++)
        if (pi[i] == n)           // 匹配成功！
            ans.push_back(i - 2 * n);  // 原串中的起始位置
    return ans;
}
```

> 分隔符 `#` 必须不在 pattern 和 text 中出现

---

## 经典模板（双指针匹配，下标从 1 开始）

```cpp
// 求 next 数组
void getNext(string &s, int nxt[]) {
    int j = 0;
    for (int i = 2; i <= s.size() - 1; i++) {
        while (j && s[i] != s[j + 1]) j = nxt[j];
        if (s[i] == s[j + 1]) j++;
        nxt[i] = j;
    }
}

// 匹配过程
void kmp(string &text, string &pat, int nxt[]) {
    int j = 0;
    for (int i = 1; i < text.size(); i++) {
        while (j && text[i] != pat[j + 1]) j = nxt[j];
        if (text[i] == pat[j + 1]) j++;
        if (j == pat.size() - 1) {
            cout << i - j + 1 << '\n';  // 输出匹配位置
            j = nxt[j];
        }
    }
}
```

---

## 前缀函数的应用

| 应用 | 方法 | 复杂度 |
|------|------|:--:|
| **最小循环节** | `len = n - π[n-1]`，若 `len ∣ n` 则是周期 | $O(n)$ |
| **统计前缀出现次数** | `ans[π[i]] += ans[i]` 递推 | $O(n)$ |
| **本质不同子串数** | 逐字符添加，反串求 π 最大值 | $O(n^2)$ |
| **字符串压缩** | `k = n - π[n-1]`，若整除则压缩为 `k` | $O(n)$ |
| **构建自动机** | `aut[i][c]` 预处理所有转移 | $O(n\vert \Sigma\vert )$ |

---

## KMP 例题

| 题号 | 名称 | 考点 |
|:----:|------|------|
| P3375 | 【模板】KMP | 模板题 |
| P4391 | 无线传输 | 循环节 |
| P2375 | [NOI2014] 动物园 | num 数组 |
| P3426 | [POI2005] SZA-Template | 印章覆盖 |
| CF126B | Password | 前缀=后缀=子串 |
| P8085 | [COCI2011] Kriptogram | KMP + 差分匹配 |

---

<!-- _class: lead -->

## 二、Z 函数（扩展 KMP）

---

## Z 函数的定义

> **z[i]** = 字符串 $s$ 与后缀 $s[i..n-1]$ 的**最长公共前缀（LCP）**长度。

```
s = "aaabaab"
z = [0, 2, 1, 0, 2, 1, 0]   (z[0] 约定为 0)

s = "abacaba"
z = [0, 0, 1, 0, 3, 0, 1]
         ↑          ↑
    s[2..]=="acaba"   s[4..]=="aba"
    LCP = "a"         LCP = "aba" 
```

**Z-box**：`[i, i+z[i]-1]` 称为匹配段。算法维护**右端点最靠右**的 Z-box `[l, r]`。

---

## Z 函数线性算法

**三种情况**：

1. `i > r`：在 Z-box 外 → 暴力逐字符扩展
2. `i ≤ r` 且 `z[i-l] < r-i+1`：对称段安全 → 直接 `z[i] = z[i-l]`
3. `i ≤ r` 且 `z[i-l] ≥ r-i+1`：对称段超出边界 → 从 `r-i+1` 开始暴力扩展


---

```cpp
vector z_function(string s) {
    int n = s.size();
    vector z(n);
    for (int i = 1, l = 0, r = 0; i < n; i++) {
        if (i <= r && z[i - l] < r - i + 1)
            z[i] = z[i - l];              // 直接继承
        else {
            z[i] = max(0, r - i + 1);
            while (i + z[i] < n && s[z[i]] == s[i + z[i]])
                z[i]++;                   // 暴力扩展
        }
        if (i + z[i] - 1 > r)
            l = i, r = i + z[i] - 1;      // 更新 Z-box
    }
    return z;
}
```

> 复杂度 $O(n)$：每次暴力扩展都使 $r$ 至少右移 1 位

---

## Z 函数 vs KMP：应用对比

| 应用 | Z 函数 | KMP |
|------|:--:|:--:|
| 模式匹配 | 拼接 `p+#+t`，$z[i]=|p|$ 即匹配 | 拼接 `p+#+t`，$π[i]=|p|$ 即匹配 |
| 求 LCP | ✅ 天然支持 | ❌ 不方便 |
| 循环节/周期 | 找最小 $i$ 使 $i+z[i]=n$ | `n - π[n-1]` |
| 本质不同子串 | $O(n^2)$ | $O(n^2)$ |

**选择建议**：需要 LCP 用 Z 函数；需要 border/循环节用 KMP。两者功能重叠，掌握一个也可以。

---

## Z 函数例题

| 题号 | 名称 | 考点 |
|:----:|------|------|
| P5410 | 【模板】扩展 KMP | Z 函数模板 |
| P7114 | [NOIP2020] 字符串匹配 | Z 函数 + 枚举 |
| CF126B | Password | Z 函数 + KMP 双解 |
| CF432D | Prefixes and Suffixes | Z 函数统计 |

---

<!-- _class: lead -->

## 三、Manacher（马拉车）

---

## Manacher：$O(n)$ 求所有回文子串

**核心问题**：求一个字符串的**最长回文子串**。

```
朴素：枚举中心 + 向两边扩展 → O(n²)
Manacher：利用回文的对称性 → O(n)
```

**关键定义**：
- $d_1[i]$：以 $i$ 为中心的**奇数**长度回文半径
- $d_2[i]$：以 $i$ 和 $i+1$ 之间为中心的**偶数**长度回文半径

```
s = "abacaba"
d1 = [1, 1, 2, 1, 4, 1, 1]
                 ↑  "abacaba" 本身是回文，半径 4
```

---

## 统一奇偶回文：插入分隔符

在原串每两个字符间插入 `#`，首尾加哨兵：

```
原串: "abacaba"
新串: "^#a#b#a#c#a#b#a#$"

所有回文都是奇回文！只需跑 d1 算法即可。
原串最长回文长度 = max(d1[i]) - 1
```

```cpp
// 预处理
int m = 0;
t[++m] = '$'; t[++m] = '#';
for (int i = 1; i <= n; i++) {
    t[++m] = s[i];
    t[++m] = '#';
}
t[++m] = '!';
```

> 首尾不同哨兵防止 `while` 越界

---

## Manacher 核心代码

```cpp
int mid = 0, r = 0, ans = 0;   // [mid-d1[mid]+1, mid+d1[mid]-1]
for (int i = 2; i < m; i++) {
    // 1. 初始化半径
    if (i <= r)
        p[i] = min(p[2 * mid - i], r - i + 1);  // 对称继承
    else
        p[i] = 1;                                // 朴素开始

    // 2. 暴力扩展
    while (t[i - p[i]] == t[i + p[i]]) p[i]++;

    // 3. 更新最右边界
    if (i + p[i] - 1 > r) {
        mid = i;
        r = i + p[i] - 1;
    }
    ans = max(ans, p[i]);
}
printf("%d\n", ans - 1);  // 最长回文长度 = 最大半径 - 1
```

> 复杂度 $O(n)$：每次 `while` 扩展使 `r` 右移，而 `r` 单调不减

---

## 分类计算 d1 和 d2（不插入分隔符）

```cpp
// 奇数长度回文 d1
vector d1(n);
for (int i = 0, l = 0, r = -1; i < n; i++) {
    int k = (i > r) ? 1 : min(d1[l + r - i], r - i + 1);
    while (i - k >= 0 && i + k < n && s[i - k] == s[i + k]) k++;
    d1[i] = k--;
    if (i + k > r) { l = i - k; r = i + k; }
}

// 偶数长度回文 d2
vector d2(n);
for (int i = 0, l = 0, r = -1; i < n; i++) {
    int k = (i > r) ? 0 : min(d2[l + r - i + 1], r - i + 1);
    while (i - k - 1 >= 0 && i + k < n && s[i - k - 1] == s[i + k]) k++;
    d2[i] = k--;
    if (i + k > r) { l = i - k - 1; r = i + k; }
}
```

---

## Manacher 例题

| 题号 | 名称 | 考点 |
|:----:|------|------|
| P3805 | 【模板】manacher | 模板题 |
| P4555 | [国家集训队] 最长双回文串 | 双回文拼接 |
| P1659 | [国家集训队] 拉拉队排练 | 回文 + 计数 |
| P6216 | 回文匹配 | Manacher + KMP |

---

<!-- _class: lead -->

## 四、AC 自动机
### Aho–Corasick Automaton

---

## AC 自动机：Trie + KMP

**解决的问题**：给定文本串 $S$ 和 $n$ 个模式串 $T_1, \dots, T_n$，求每个模式串的出现情况。

> **Trie 树（前缀树）+ KMP 的 fail 思想 = AC 自动机**

```
       根 (0)
      /  |  \
     a   b   h
    /    |    \
   b    c     e
  /     |      \
 c     d       r
(abc) (bcd)   (her)
```

**fail 指针**：指向当前节点表示字符串的**最长后缀**，且该后缀是某个模式串的前缀。

---

## 构建 AC 自动机（BFS + Trie 图）

```cpp
int tr[N][26];   // Trie / Trie图
int fail[N];     // fail 指针
int cnt[N];      // 以该节点结尾的模式串数

void build() {
    queue q;
    // 根的儿子入队
    for (int i = 0; i < 26; i++)
        if (tr[0][i]) q.push(tr[0][i]);

    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int i = 0; i < 26; i++) {
            if (tr[u][i]) {
                fail[tr[u][i]] = tr[fail[u]][i];  // 设置 fail
                q.push(tr[u][i]);
            } else {
                tr[u][i] = tr[fail[u]][i];  // ★ Trie图优化
            }
        }
    }
}
```

> `else tr[u][i] = tr[fail[u]][i]` 将不存在的儿子连到 fail 的对应儿子，避免反复跳 fail

---

## 匹配过程

```cpp
int query(char *t) {
    int u = 0, res = 0;
    for (int i = 0; t[i]; i++) {
        u = tr[u][t[i] - 'a'];     // 在 Trie 图上移动
        for (int j = u; j && cnt[j] != -1; j = fail[j]) {
            res += cnt[j];          // 统计匹配
            cnt[j] = -1;            // 防重复统计
        }
    }
    return res;
}
```

> 跳 fail 链 = 找到所有以当前字符结尾的后缀匹配

---

## fail 树优化（拓扑排序）

暴力跳 fail 可能退化为 $O(\vert S\vert  \cdot n)$。优化：匹配时只**打标记**，最后沿 fail 树**拓扑求和**。

---

```cpp
// 匹配时只打标记
void query(char *t) {
    int u = 0;
    for (int i = 0; t[i]; i++) {
        u = tr[u][t[i] - 'a'];
        cnt[u]++;  // 只计数，不跳 fail
    }
}

// 拓扑排序求子树和
void topu() {
    queue q;
    for (int i = 0; i <= tot; i++)
        if (du[i] == 0) q.push(i);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        ans[idx[u]] = cnt[u];
        int v = fail[u];
        cnt[v] += cnt[u];          // 向 fail 父节点累加
        if (--du[v] == 0) q.push(v);
    }
}
```

> fail 指针构成一棵树（fail 树），因为 fail 深度严格递减。

---

## AC 自动机 + DP

AC 自动机常结合 DP 解决"构造不包含某些模式串的字符串"类问题。

**经典框架**：
- 状态：`dp[pos][state]` = 在 AC 自动机节点 `state`，已构造 `pos` 个字符
- 转移：枚举下一个字符 `c`，走 `tr[state][c]`
- 禁止状态：包含模式串结尾的节点（及沿 fail 可达的）

**例题**：
| 题号 | 名称 | 考点 |
|:----:|------|------|
| P3808 | 【模板】AC 自动机（简单） | 基础模板 |
| P5357 | 【模板】AC 自动机（二次加强） | fail 树 / 拓扑优化 |
| P4052 | [JSOI2007] 文本生成器 | AC + DP |
| P2414 | [NOI2011] 阿狸的打字机 | fail 树 + 离线 |
| P2444 | [POI2000] 病毒 | Trie 图找环 |
| P3311 | [SDOI2014] 数数 | 数位 DP + AC |

---

<!-- _class: lead -->

## 五、总结与对比

---

## 四种算法对比总结

| | KMP | Z 函数 | Manacher | AC 自动机 |
|------|:--:|:--:|:--:|:--:|
| **用途** | 单模式匹配 | LCP / 匹配 | 回文子串 | 多模式匹配 |
| **核心数据结构** | 前缀函数 π | Z 数组 | 回文半径 d1/d2 | Trie + fail |
| **时间** | $O(n+m)$ | $O(n)$ | $O(n)$ | $O(\sum s_i + S)$ |
| **空间** | $O(m)$ | $O(n)$ | $O(n)$ | $O(\sum s_i \cdot \Sigma)$ |
| **在线/离线** | 在线 | 离线 | 在线 | 离线（建树后在线匹配） |

---

## 算法的递进关系

```
字符串基础
    │
    ├── 前缀函数 π (KMP)  ──→ AC 自动机（Trie + KMP）
    │                              └── fail 树 + DP
    │
    ├── Z 函数（扩展 KMP）──→ 与 KMP 互补，侧重 LCP
    │
    └── Manacher ──→ Z-box 思想的回文特化
```

> KMP 的前缀函数 π 是整个字符串算法的**核心基石**，AC 自动机本质上就是 π 在多模式串上的推广。

---

## 核心要点回顾

1. **KMP**：`j = π[j-1]` 失配跳转，`π[i]` 表示 border 长度。最小循环节 = `n - π[n-1]`
2. **Z 函数**：`z[i]` = LCP(s, s[i..])，利用 Z-box 对称继承。模式匹配拼接 `p+#+t`
3. **Manacher**：维护最右回文边界对称拷贝半径。插 `#` 统一奇偶，`max(p[i]) - 1` 即答案
4. **AC 自动机**：Trie + fail 指针。Trie 图优化 `tr[u][i] = tr[fail[u]][i]`。大数据用 fail 树拓扑求和

> 所有高效字符串算法的核心：**维护已处理信息，用对称/继承替代重复计算。**

---

## 例题汇总

| 题号 | 名称 | 算法 |
|:----:|------|:--:|
| P3375 | 【模板】KMP 字符串匹配 | KMP |
| P5410 | 【模板】扩展 KMP | Z 函数 |
| P3805 | 【模板】manacher | Manacher |
| P3808 | 【模板】AC 自动机（简单版） | AC 自动机 |
| P5357 | 【模板】AC 自动机（二次加强） | fail 树优化 |
| P2375 | [NOI2014] 动物园 | KMP |
| P4555 | [国家集训队] 最长双回文串 | Manacher |
| P2414 | [NOI2011] 阿狸的打字机 | AC 自动机 + fail 树 |

---

<!-- _class: lead -->

# Thanks！

