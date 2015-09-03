<script type="text/tpl" id="not-this">
<div>Not this template.</div>
</script>
<script type="text/tpl" id="test">
<h1>{{title}}</h1>
<ul pc-if="{{member}}">
    <li pc-repeat="{{ member }}">{{$index+1}}. Name: {{name}} Age: {{ age }}</li>
</ul>
<p>Here and I say {{ content + " five."}}</p>
<ul pc-if="{{times}}">
    <li pc-repeat="{{times }}">{{$index }} -> {{ time}}</li>
</ul>
{{obj.tl}}
<p>{{thisIsNotVar}}</p>
{{obj.al}}
</script>