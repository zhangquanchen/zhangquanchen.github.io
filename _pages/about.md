---
permalink: /
title: ""
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>

# 👋 About Me
I am currently a PhD student at [Tsinghua University](https://www.tsinghua.edu.cn/), devoted to advancing AGI by enhancing the understanding capabilities of multimodal large language models. My main focus is on reinforced reasoning, including latent reasoning, spatial reasoning, etc.. Prior to this, I earned my B.S. in Electronic Engineering from [Sun Yat-sen University](https://www.sysu.edu.cn/).

From 2026, I work as a Research Intern (青云人才计划) at [Hunyuan Group](https://hunyuan.tencent.com/), Tencent, Inc. At the end of 2025, I was at LongCat Foundation Group, [Meituan](https://www.meituan.com/), Inc., working with [Manyuan Zhang](https://scholar.google.com.hk/citations?user=ZYmcm0EAAAAJ&hl=en). Before that, I worked as a Research Intern (筋斗云人才计划) at [ByteDance](https://www.bytedance.com/zh/), working with [Ruihui Zhao](https://scholar.google.com/citations?user=0okAFQMAAAAJ&hl=en) and [Yangyang Kang](https://scholar.google.com/citations?user=EuJk27UAAAAJ&hl=zh-CN). From 2024 to 2025, I worked as a Research Intern at AI/ML Group of [Microsoft Research Asia (MSRA)](https://www.microsoft.com/en-us/research/lab/microsoft-research-asia-zh-cn/), working with [Xufang Luo](https://www.microsoft.com/en-us/research/people/xufluo/) and [Dongsheng Li](https://scholar.google.com/citations?hl=zh-CN&user=VNg5rA8AAAAJ&view_op=list_works&sortby=pubdate). I also interned at QQ Foundation Group, [Tencent](https://www.tencent.com/en-us/), Inc. in 2024, working with [Dian Li](https://scholar.google.com/citations?user=rF7HU94AAAAJ&hl=zh-CN).

Since 2023, I have been CTO and Co-founder of [Beijing OneXOne Tech Co., Ltd.](https://shizhe.chat/), an AI education startup that has completed Series A funding.

I am currently seeking suitable collaboration or job opportunities. Feel free to reach out! ([czq23@mails.tsinghua.edu.cn](mailto:czq23@mails.tsinghua.edu.cn)).


<span class='anchor' id='news'></span>

# 🔥 News
- *2026.02*: &nbsp;🎉 Three papers accepted by CVPR 2026.
- *2026.01*: &nbsp;🎉 One paper accepted by ICLR 2026.
- *2025.11*: &nbsp;🎉 Two papers accepted by AAAI 2026, one as <span style="color:red">Oral</span> (top 3.5%).
- *2025.06*: &nbsp;🎉 One paper accepted by ICCV 2025.
- *2025.04*: &nbsp;🎉 One paper accepted by CVPRW 2025 Highlight.
- *2025.03*: &nbsp;🎉 One paper accepted by CVPR 2025.
- *2024.04*: &nbsp;🎉 One paper accepted by ICANN 2024. 

<span class='anchor' id='education'></span>

# 📖 Education
- **Sep. 2026 - Dec. 2027:** **Ph.D**., Data Science and Information Technology, **Tsinghua University**, Beijing, China.
- **Sep. 2023 - Jun. 2026:** M.Sc.(change to Ph.D.), Data Science and Information Technology, **Tsinghua University**, Beijing, China.
- **Sep. 2019 - Jun. 2023:** B.Sc., Electronic Information Science and Technology, Sun Yat-sen University, Guangzhou, China. (**Rank 2/123**)

<span class='anchor' id='publications'></span>

# 📝 Publications 
<!-- <p style="font-size: 0.9em; color: #666; margin-bottom: 1em;">† Equal contribution</p> -->
<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">ICCV</div>
      <img src='images/visrl.png' alt="VisRL" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>VisRL: Intention-Driven Visual Perception via Reinforced Reasoning</div>
    <div class='paper-authors'><strong>Zhangquan Chen</strong>, Xufang Luo, Dongsheng Li</div>
    <div class='paper-venue'>International Conference on Computer Vision (<strong>ICCV</strong>) & CVPRW <strong>Highlight</strong>, 2025</div>
    <div class='paper-links'>
      <a href="https://tsinghua88.github.io/visrl.github.io/"><i class="fas fa-home"></i> Project page</a>
      <span class="link-sep">|</span>
      <a href="https://openaccess.thecvf.com/content/ICCV2025/papers/Chen_VisRL_Intention-Driven_Visual_Perception_via_Reinforced_Reasoning_ICCV_2025_paper.pdf"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://github.com/zhangquanchen/VisRL"><i class="fab fa-github"></i> Code</a>
    </div>
  </div>
</div>

<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">CVPR</div>
      <img src='images/dv-matcher.png' alt="DV-Matcher" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>DV-Matcher: Deformation-based Non-Rigid Point Cloud Matching Guided by Pre-trained Visual Features</div>
    <div class='paper-authors'><strong>Zhangquan Chen</strong>, Puhua Jiang, Ruqi Huang</div>
    <div class='paper-venue'>Computer Vision and Pattern Recognition (<strong>CVPR</strong>), 2025</div>
    <div class='paper-links'>
      <a href="https://openaccess.thecvf.com/content/CVPR2025/papers/Chen_DV-Matcher_Deformation-based_Non-rigid_Point_Cloud_Matching_Guided_by_Pre-trained_Visual_CVPR_2025_paper.pdf"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://github.com/rqhuang88/DV-Matcher"><i class="fab fa-github"></i> Code</a>
      <span class="link-sep">|</span>
      <a href="https://drive.google.com/drive/folders/1CK9qihI2yyxkuXsxSHqzTRhLdTk8qghn"><i class="fas fa-database"></i> Dataset</a>
    </div>
  </div>
</div>

<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">AAAI</div>
      <img src='images/sifthinker.png' alt="SIFThinker" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>SIFThinker: Spatially-Aware Image Focus for Visual Reasoning</div>
    <div class='paper-authors'><strong>Zhangquan Chen</strong>, Ruihui Zhao, Chuwei Luo, Mingze Sun, Xinlei Yu, Yangyang Kang, Ruqi Huang</div>
    <div class='paper-venue'><strong>AAAI</strong> Conference on Artificial Intelligence (<strong>AAAI</strong>), 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2508.06259"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://github.com/zhangquanchen/SIFThinker"><i class="fab fa-github"></i> Code</a>
      <span class="link-sep">|</span>
      <a href="https://huggingface.co/datasets/jankin123/SIF-50K"><i class="fas fa-database"></i> Dataset</a>
    </div>
  </div>
</div>

<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">CVPR</div>
      <img src='images/3dthinker.png' alt="3DThinker" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>Think with 3D: Geometric Imagination Grounded Spatial Reasoning from Limited Views</div>
    <div class='paper-authors'><strong>Zhangquan Chen</strong>, Manyuan Zhang, Xinlei Yu, Xufang Luo, Mingze Sun, Zihao Pan, Yan Feng, Peng Pei, Xunliang Cai, Ruqi Huang</div>
    <div class='paper-venue'>Computer Vision and Pattern Recognition (<strong>CVPR</strong>), 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2510.18632"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://github.com/zhangquanchen/3DThinker"><i class="fab fa-github"></i> Code</a>
      <span class="link-sep">|</span>
      <a href="https://huggingface.co/datasets/jankin123/3DThinker-10K"><i class="fas fa-database"></i> Dataset</a>
      <span class="link-sep">|</span>
      <a href="https://huggingface.co/jankin123/3DThinker-Mindcube"><i class="fas fa-cube"></i> Model</a>
    </div>
  </div>
</div>

<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">arXiv</div>
      <img src='images/omnivideo-r1.png' alt="OmniVideo-R1" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>OmniVideo-R1: Reinforcing Audio-visual Reasoning with Query Intention and Modality Attention</div>
    <div class='paper-authors'><strong>Zhangquan Chen</strong>, Jiale Tao, Ruihuang Li, Yihao Hu, Ruitao Chen, Zhantao Yang, Xinlei Yu, Haodong Jing, Manyuan Zhang, Shuai Shao, Biao Wang, Qinglin Lu, Ruqi Huang</div>
    <div class='paper-venue'>arXiv 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2602.05847"><i class="fas fa-file-pdf"></i> Paper</a>
    </div>
  </div>
</div>

<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">ICANN</div>
      <img src='images/threephase.png' alt="Three-Phases-LORA" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>A Three-Phases-LORA Finetuned Hybrid LLM Integrated with Strong Prior Module in the Education Context</div>
    <div class='paper-authors'><strong>Zhangquan Chen</strong>, Chunjiang Liu, Haobin Duan</div>
    <div class='paper-venue'>International Conference on Artificial Neural Networks, 2024</div>
    <div class='paper-links'>
      <a href="https://link.springer.com/chapter/10.1007/978-3-031-72344-5_16"><i class="fas fa-file-pdf"></i> Paper</a>
    </div>
  </div>
</div>

<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">arXiv</div>
      <img src='images/a-grae.png' alt="A-GRAE" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>Unveiling Implicit Advantage Symmetry: Why GRPO Struggles with Exploration and Difficulty Adaptation</div>
    <div class='paper-authors'>Zhiqi Yu†, <strong>Zhangquan Chen</strong>†, Mengting Liu, Heye Zhang, Liangqiong Qu</div>
    <div class='paper-venue'>(† equal contribution) arXiv 2026</div>
    <div class='paper-links'>
      <a href="https://yu7-code.github.io/A-GRAE-web/"><i class="fas fa-home"></i> Project page</a>
      <span class="link-sep">|</span>
      <a href="https://arxiv.org/pdf/2602.05548"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://github.com/HKU-HealthAI/A-GRAE"><i class="fab fa-github"></i> Code</a>
    </div>
  </div>
</div>

<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">arXiv</div>
      <img src='images/nfr.gif' alt="NFR" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>NFR: Neural Feature-Guided Non-Rigid Shape Registration</div>
    <div class='paper-authors'>Puhua Jiang†, <strong>Zhangquan Chen</strong>†, Mingze Sun†, Ruqi Huang</div>
    <div class='paper-venue'>(† equal contribution) arXiv 2025</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2505.22445"><i class="fas fa-file-pdf"></i> Paper</a>
    </div>
  </div>
</div>

<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">ICLR</div>
      <img src='images/vif.png' alt="ViF" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>Visual Multi-Agent System: Mitigating Hallucination Snowballing via Visual Flow</div>
    <div class='paper-authors'>Xinlei Yu, Chengming Xu, Guibin Zhang, Yongbo He, <strong>Zhangquan Chen</strong>, Zhucun Xue, Jiangning Zhang, Yue Liao, Xiaobin Hu, Yu-Gang Jiang, Shuicheng Yan</div>
    <div class='paper-venue'>International Conference on Learning Representations (<strong>ICLR</strong>), 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2509.21789"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://github.com/YU-deep/ViF"><i class="fab fa-github"></i> Code</a>
    </div>
  </div>
</div>

<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">arXiv</div>
      <img src='images/calmars.png' alt="CALMARS" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>Adversarial Robustness for Unified Multi-Modal Encoders via Efficient Calibration</div>
    <div class='paper-authors'>Chih-Ting Liao, <strong>Zhangquan Chen</strong>, Chunlei Meng, Tzu-Yu Huang, Xin Cao, Xu Zheng</div>
    <div class='paper-venue'>arXiv 2025</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2505.11895"><i class="fas fa-file-pdf"></i> Paper</a>
    </div>
  </div>
</div>

<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">CVPR</div>
      <img src='images/visualdoc.png' alt="MACT" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>Visual Document Understanding and Reasoning: A Multi-Agent Collaboration Framework with Agent-Wise Adaptive Test-Time Scaling</div>
    <div class='paper-authors'>Xinlei Yu, Chengming Xu, <strong>Zhangquan Chen</strong>, Yudong Zhang, Shilin Lu, Cheng Yang, Jiangning Zhang, Shuicheng Yan, Xiaobin Hu</div>
    <div class='paper-venue'>Computer Vision and Pattern Recognition (<strong>CVPR</strong>), 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2508.03404"><i class="fas fa-file-pdf"></i> Paper</a>
    </div>
  </div>
</div>

<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">arXiv</div>
      <img src='images/reasonvla.png' alt="Reasoning-VLA" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>Reasoning-VLA: A Fast and General Vision-Language-Action Reasoning Model for Autonomous Driving</div>
    <div class='paper-authors'>Dapeng Zhang, Zhenlong Yuan, <strong>Zhangquan Chen</strong>, Chih-Ting Liao, Yinda Chen, Fei Shen, Qingguo Zhou, Tat-Seng Chua</div>
    <div class='paper-venue'>arXiv 2025</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2511.19912"><i class="fas fa-file-pdf"></i> Paper</a>
    </div>
  </div>
</div>

<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">arXiv</div>
      <img src='images/dualagent.png' alt="L²-VMAS" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>Dual Latent Memory for Visual Multi-agent System</div>
    <div class='paper-authors'>Xinlei Yu, Chengming Xu, <strong>Zhangquan Chen</strong>, Bo Yin, Cheng Yang, Yongbo He, Yihao Hu, Jiangning Zhang, Cheng Tan, Xiaobin Hu, Shuicheng Yan</div>
    <div class='paper-venue'>arXiv 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2602.00471"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://github.com/YU-deep/L2-VMAS"><i class="fab fa-github"></i> Code</a>
    </div>
  </div>
</div>

<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">CVPR</div>
      <img src='images/vismem.png' alt="VisMem" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>VisMem: Latent Vision Memory Unlocks Potential of Vision-Language Models</div>
    <div class='paper-authors'>Xinlei Yu, Chengming Xu, Guibin Zhang, <strong>Zhangquan Chen</strong>, Yudong Zhang, Yongbo He, Peng-Tao Jiang, Jiangning Zhang, Xiaobin Hu, Shuicheng Yan</div>
    <div class='paper-venue'>Computer Vision and Pattern Recognition (<strong>CVPR</strong>), 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2511.11007"><i class="fas fa-file-pdf"></i> Paper</a>
      <span class="link-sep">|</span>
      <a href="https://github.com/YU-deep/VisMem"><i class="fab fa-github"></i> Code</a>
    </div>
  </div>
</div>

<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">arXiv</div>
      <img src='images/topology.png' alt="OmniZoo" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>Topology-Agnostic Animal Motion Generation from Text Prompt</div>
    <div class='paper-authors'>Keyi Chen, Mingze Sun, Zhenyu Liu, <strong>Zhangquan Chen</strong>, Ruqi Huang</div>
    <div class='paper-venue'>arXiv 2025</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2512.10352"><i class="fas fa-file-pdf"></i> Paper</a>
    </div>
  </div>
</div>

<div class='paper-box'>
  <div class='paper-box-image'>
    <div class='paper-image-wrap'>
      <div class="badge">arXiv</div>
      <img src='images/evofsm.png' alt="EvoFSM" style="width: 160px; max-height: 200px; object-fit: contain;">
    </div>
  </div>
  <div class='paper-box-text'>
    <div class='paper-title'>EvoFSM: Controllable Self-Evolution for Deep Research with Finite State Machines</div>
    <div class='paper-authors'>Shuo Zhang, Chaofa Yuan, Ryan Guo, Xiaomin Yu, Rui Xu, <strong>Zhangquan Chen</strong>, Zinuo Li, Zhi Yang, Shuhao Guan, Zhenheng Tang, Sen Hu, Liwen Zhang, Ronghao Chen, Huacan Wang</div>
    <div class='paper-venue'>arXiv 2026</div>
    <div class='paper-links'>
      <a href="https://arxiv.org/pdf/2601.09465"><i class="fas fa-file-pdf"></i> Paper</a>
    </div>
  </div>
</div>

<span class='anchor' id='internships'></span>

# 💼 Internships
- **Dec 2025 – Present:** [Tencent](https://www.tencent.com/en-us/) · Research Intern (青云人才计划) · [Hunyuan](https://hunyuan.tencent.com/) Multimodal LLM Group
- **Aug 2025 – Dec 2025:** [Meituan](https://www.meituan.com/) · Research Intern · M17 LongCat Foundation Model Group
- **Apr 2025 – Aug 2025:** [ByteDance](https://www.bytedance.com/zh/) · Research Intern (筋斗云人才计划) · Multimodal LLM Content Understanding Group
- **Dec 2024 – Mar 2025:** [Microsoft Research Asia](https://www.microsoft.com/en-us/research/lab/microsoft-research-asia-zh-cn/) · Research Intern (Rising Star Award) · AI/ML Group
- **May 2024 – Aug 2024:** [Tencent](https://www.tencent.com/en-us/) · Research Intern · QQ Multimodal LLM Group
- **Apr 2023 – 2025:** [Beijing OneXOne Tech Co., Ltd.](https://shizhe.chat/) · Chief Technology Officer and Co-founder

<span class='anchor' id='honors-and-awards'></span>

# 🎖 Honors and Awards
### 🏅 Honor Recognitions
- **Sun Yat-sen University Outstanding Graduate**
- **Sun Yat-sen University Outstanding Graduation Thesis (Rank 1)**
- Sun Yat-sen University Outstanding Role Model
- Sun Yat-sen University Outstanding League Member (2020, 2021)
- Suzhou Innovation and Entrepreneurship Leading Talent
- Microsoft Research Asia Rising Star Award (Top 10%)

### 💰 Scholarship Awards
- **National Scholarship (2022)**
- Tsinghua University Scholarship (2025)
- Shanghai Institute of Organic Chemistry, CAS Scholarship (2020)
- Sun Yat-sen University Outstanding Undergraduate Scholarship (2020, 2021, 2022)
- Sun Yat-sen University Discipline Competition Scholarship

### 🏆 Academic Competitions
- **Outstanding Winner (<span style="color:red">1st globally, Top 0.03%</span>), 7th SW International College Mathematical Modeling Competition (2022)**
- **First Prize, National College Mathematical Modeling Competition (2020)**
- Second Prize, 12th National College Mathematics Competition (2020)
- Second Prize, Asia-Pacific Mathematical Modeling Competition (2021)
- Honorable Mention, American Mathematical Contest in Modeling (2021)
- Second Prize, National CYC Cup Mathematical Modeling Competition (2022)
- Third Prize, Programming Competition (2020)
- Merit Award, National Olympiad in Mathematics (2020)
- Merit Award, Electronic Design Competition (2020)

### ⭐ Talent Programs
- **Tencent Qingyun Top Talent Program (腾讯青云人才计划)**
- ByteDance Jindouyun Top Talent Program (字节筋斗云人才计划)
- Jingdong Top Young Technical Genius (TGT) Program (京东TGT人才计划)
- Meituan Beidou Top Talent Program（美团北斗人才计划）
- ModelBest "Ahead Four" Top Talent Program (面壁前进四人才计划)

<!-- - *2021.06*, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ornare aliquet ipsum, ac tempus justo dapibus sit amet. 
- *2021.03*, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ornare aliquet ipsum, ac tempus justo dapibus sit amet.  \| [\[video\]](https://github.com/) -->

<!-- # 💻 Internships
- *2019.05 - 2020.02*, [Lorem](https://github.com/), China. -->

<span class='anchor' id='services'></span>

# 💬 Services
**Reviewer:** ICML, ICLR, AAAI, and other top-tier conferences/journals in computer vision and machine learning.

<span class='anchor' id='visitor-stats'></span>

# 📊 Visitor Statistics

<div class="visitor-stats" style="margin: 2em 0; padding: 1.5em; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef; text-align: center;">
  <script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
  <span id="busuanzi_container_site_uv" style="margin-right: 1.5em;">
    <i class="fas fa-user" style="margin-right: 0.3em;"></i>
    Total visitors: <span id="busuanzi_value_site_uv"></span>
  </span>
  <span id="busuanzi_container_page_pv">
    <i class="fas fa-file-alt" style="margin-right: 0.3em;"></i>
    Page views: <span id="busuanzi_value_page_pv"></span>
  </span>
</div>